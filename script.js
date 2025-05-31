document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const buyBtn     = document.getElementById("buy-btn");
  const compraBox  = document.getElementById("compra");
  const msg        = document.getElementById("msg");

  let userEmail = null;   // guardamos o e-mail aqui

  // === LOGIN SIMPLES =======================================================
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    userEmail = document.getElementById("email").value.trim();
    if (!userEmail) return;

    msg.textContent = `Logado como: ${userEmail}`;
    loginForm.style.display = "none";
    compraBox.style.display = "block";
  });

  // === BOTÃO COMPRAR =======================================================
  buyBtn.addEventListener("click", async () => {
    if (!userEmail) {
      msg.textContent = "Faça login primeiro.";
      return;
    }

    msg.textContent = "Gerando preferência…";

    // Dados enviados para o backend (pode ajustar se quiser salvar o e-mail)
    const data = {
      title: "BOT",
      quantity: 1,
      unit_price: 199.99,
      payer_email: userEmail        // backend ignora ou usa — opcional
    };

    try {
      const response = await fetch(
        "https://vortsi-bakcend.onrender.com/create_preference",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) throw new Error("Erro ao criar preferência");

      const result = await response.json();

      // Redireciona para o Checkout Pro
      window.location.href = result.init_point;

    } catch (err) {
      msg.textContent = "Erro ao iniciar pagamento (veja o console).";
      console.error(err);
    }
  });
});
