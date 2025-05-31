async function comprar() {
  const resposta = document.getElementById("resposta");

  const res = await fetch("/pay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: "TEST-TOKEN-VALOR",
      payment_method_id: "visa",
      issuer_id: "default",
      amount: 199.99,
      email: "email@example.com"
    })
  });

  const data = await res.json();

  if (data.status === "approved") {
    resposta.innerText = "Pagamento aprovado e status alterado!";
  } else {
    resposta.innerText = "Falha no pagamento: " + (data.status_detail || "Erro desconhecido");
  }
}