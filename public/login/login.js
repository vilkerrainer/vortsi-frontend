const backendUrl = "https://vortsi-bakcend.vercel.app";

// Elementos DOM
const loginForm = document.getElementById('login-form');
const messageDiv = document.getElementById('message');

// Mostrar mensagem
function showMessage(text, isSuccess) {
  if (messageDiv) {
    messageDiv.textContent = text;
    messageDiv.className = isSuccess ? 'message-success show' : 'message-error show';
    
    setTimeout(() => {
      messageDiv.classList.remove('show');
    }, 5000);
  }
}

// Validações
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateLoginForm() {
  const email = document.getElementById('email')?.value;
  const password = document.getElementById('password')?.value;

  if (!email || !password) {
    showMessage('Por favor, preencha todos os campos.', false);
    return false;
  }

  if (!validateEmail(email)) {
    showMessage('Por favor, insira um email válido.', false);
    return false;
  }

  return true;
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!validateLoginForm()) return;

    showMessage('Autenticando...', true);

    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, senha: password })
      });

      const data = await response.json();

      if (response.ok) {
        // Armazena os dados do usuário no localStorage
        localStorage.setItem('userData', JSON.stringify(data.user));
        showMessage('Login realizado com sucesso! Redirecionando...', true);
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        showMessage(data.error || 'Erro no login. Verifique suas credenciais.', false);
      }
    } catch (error) {
      showMessage('Erro na conexão com o servidor. Tente novamente.', false);
    }
  });
}