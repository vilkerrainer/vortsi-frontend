const backendUrl = "https://vortsi-bakcend.onrender.com"; // Mude para seu backend

let stripe = Stripe("pk_test_51RUgp1P3MA7BPdVed5FX9pQ2AJZ7jguWyoWFVYemb96sAptDX2gxW4op48ok5F1yp1v1xZFJPjbmb5vUsjt7vPu300ibpEFWRG"); // Substitua pela sua chave pública Stripe

const elements = stripe.elements();
const cardElement = elements.create("card");
cardElement.mount("#card-element");

const loginForm = document.getElementById("login-form");
const paymentForm = document.getElementById("payment-form");
const messageDiv = document.getElementById("message");
const userInfoDiv = document.getElementById("user-info");
const userNomeSpan = document.getElementById("user-nome");
const userPagoSpan = document.getElementById("user-pago");
const logoutBtn = document.getElementById("logout-btn");

let userEmail = "";
let userNome = "";
let userPago = 0;

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageDiv.textContent = "";

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const res = await fetch(backendUrl + "/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Erro no login");

    userEmail = email;
    userNome = data.nome;
    userPago = data.pago;

    userNomeSpan.textContent = userNome;
    userPagoSpan.textContent = userPago === 1 ? "Pago" : "Não pago";

    loginForm.style.display = "none";
    userInfoDiv.style.display = "block";
  } catch (err) {
    messageDiv.textContent = err.message;
  }
});

paymentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageDiv.textContent = "";
  document.getElementById("pay-button").disabled = true;

  const valor = parseFloat(document.getElementById("valor").value);

  if (!valor || valor <= 0) {
    messageDiv.textContent = "Informe um valor válido";
    document.getElementById("pay-button").disabled = false;
    return;
  }

  try {
    // Pega client_secret do backend
    const res = await fetch(backendUrl + "/create_payment_intent", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ valor, email: userEmail }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro ao criar pagamento");

    const clientSecret = data.client_secret;

    // Confirma o pagamento com Stripe.js
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (result.error) {
      messageDiv.textContent = result.error.message;
      document.getElementById("pay-button").disabled = false;
    } else if (result.paymentIntent.status === "succeeded") {
      messageDiv.style.color = "green";
      messageDiv.textContent = "Pagamento efetuado com sucesso!";

      // Atualizar status pago no front (o backend será atualizado via webhook)
      userPagoSpan.textContent = "Pago";
      userPago = 1;
      document.getElementById("pay-button").disabled = false;
    }
  } catch (err) {
    messageDiv.textContent = err.message;
    document.getElementById("pay-button").disabled = false;
  }
});

logoutBtn.addEventListener("click", async () => {
  await fetch(backendUrl + "/logout", {
    method: "POST",
    credentials: "include",
  });

  userEmail = "";
  userNome = "";
  userPago = 0;

  userInfoDiv.style.display = "none";
  loginForm.style.display = "block";
  messageDiv.textContent = "";
});
