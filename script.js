document.getElementById("checkout-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById("title").value,
    quantity: parseInt(document.getElementById("quantity").value),
    unit_price: parseFloat(document.getElementById("price").value)
  };

  try {
    const response = await fetch("http://localhost:5000/create_preference", {
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
