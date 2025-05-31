document.addEventListener("DOMContentLoaded", () => {
  const buyBtn   = document.getElementById("buy-btn");
  const msgField = document.getElementById("msg");

  buyBtn.addEventListener("click", async () => {
    msgField.innerText = "Gerando preferência…";

    const data = {
      title: "BOT",            // nome do produto
      quantity: 1,             // quantidade
      unit_price: 199.99       // valor unitário (em R$)
      // opcional: incluir payer_email se quiser
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

      // redireciona para o link do Mercado Pago
      window.location.href = init_point;
    } catch (err) {
      msgField.innerText = "Erro: " + err.message;
      console.error("Erro ao criar preferência:", err);
    }
  });
});
