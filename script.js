document.addEventListener("DOMContentLoaded", () => {
  const buyBtn    = document.getElementById("buy-btn");
  const msgField  = document.getElementById("msg");
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const compraSec  = document.getElementById("compra");

  let userEmail = "";

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    userEmail = emailInput.value.trim();
    if (userEmail) {
      compraSec.style.display = "block";
      loginForm.style.display = "none";
      msgField.innerText = `Logado como: ${userEmail}`;
    }
  });

  buyBtn.addEventListener("click", async () => {
    msgField.innerText = "Gerando preferência…";

    const data = {
      title: "BOT",
      quantity: 1,
      unit_price: 199.99,
      payer_email: userEmail // envia o email junto
    };

    try {
      const res = await fetch("https://vortsi-bakcend.onrender.com/create_preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erro desconhecido");
      }

      const { init_point } = await res.json();
      window.location.href = init_point;
    } catch (err) {
      msgField.innerText = "Erro: " + err.message;
      console.error("Erro ao criar preferência:", err);
    }
  });
});
