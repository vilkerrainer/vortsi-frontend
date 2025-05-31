const mp = new MercadoPago("SEU_PUBLIC_KEY_TESTE");

async function register() {
  const nome = document.getElementById("reg_nome").value;
  const email = document.getElementById("reg_email").value;
  const senha = document.getElementById("reg_senha").value;

  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha })
  });

  const data = await res.json();
  alert(data.msg || data.error);
}

async function login() {
  const email = document.getElementById("login_email").value;
  const senha = document.getElementById("login_senha").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  const data = await res.json();
  if (data.msg) {
    alert("Logado!");
    document.getElementById("pagar").style.display = "block";
    document.getElementById("payerEmail").value = email;
  } else {
    alert(data.error);
  }
}

document.getElementById("payment-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const cardData = {
    cardNumber: document.getElementById("cardNumber").value,
    expirationMonth: document.getElementById("cardExpirationMonth").value,
    expirationYear: document.getElementById("cardExpirationYear").value,
    securityCode: document.getElementById("securityCode").value,
    cardholderName: document.getElementById("cardholderName").value
  };

  const email = document.getElementById("payerEmail").value;

  try {
    const tokenResult = await mp.fields.createCardToken({
      cardNumber: { value: cardData.cardNumber },
      expirationMonth: { value: cardData.expirationMonth },
      expirationYear: { value: cardData.expirationYear },
      securityCode: { value: cardData.securityCode },
      cardholderName: { value: cardData.cardholderName }
    });

    const res = await fetch("/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: tokenResult.id,
        payment_method_id: "visa",
        issuer_id: "",
        amount: 199.99
      })
    });

    const payResult = await res.json();
    document.getElementById("status").innerText = `Status: ${payResult.status}`;

  } catch (err) {
    console.error(err);
    alert("Erro ao gerar token de pagamento.");
  }
});