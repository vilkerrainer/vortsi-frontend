document.getElementById("checkout-button").addEventListener("click", async () => {
  const data = {
    title: "BOT",
    quantity: 1,
    unit_price: 199.99
  };

  try {
    const response = await fetch("https://vortsi-bakcend.onrender.com/create_preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error("Erro ao criar preferência");

    const result = await response.json();
    window.location.href = result.init_point;

  } catch (err) {
    alert("Erro ao iniciar pagamento. Veja o console.");
    console.error(err);
  }
});
