document.addEventListener("DOMContentLoaded", () => {
  const buyBtn   = document.getElementById("buy-btn");
  const msgField = document.getElementById("msg");

  buyBtn.addEventListener("click", async () => {
    msgField.innerText = "Gerando preferência…";

    const data = {
      title: "BOT",
      quantity: 1,
      unit_price: 199.99
      // payer_email pode ser enviado se quiser
    };

    try {
      const res = await fetch("https://vortsi-bakcend.onrender.com/create_preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      const { init_point } = await res.json();
      window.location.href = init_point;   // redireciona ao Checkout Pro
    } catch (err) {
      msgField.innerText = "Erro: " + err.message;
      console.error(err);
    }
  });
});
