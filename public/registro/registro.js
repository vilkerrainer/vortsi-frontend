const backendUrl = "https://vortsi-bakcend.vercel.app";

// Elementos DOM
const registerForm = document.getElementById('register-form');
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

function validateRegisterForm() {
  const nome = document.getElementById('nome')?.value;
  const email = document.getElementById('reg-email')?.value;
  const senha = document.getElementById('reg-senha')?.value;
  const confSenha = document.getElementById('conf-senha')?.value;

  if (!nome || !email || !senha || !confSenha) {
    showMessage('Por favor, preencha todos os campos.', false);
    return false;
  }

  if (!validateEmail(email)) {
    showMessage('Por favor, insira um email válido.', false);
    return false;
  }

  if (senha.length < 6) {
    showMessage('A senha deve ter pelo menos 6 caracteres.', false);
    return false;
  }

  if (senha !== confSenha) {
    showMessage('As senhas não coincidem.', false);
    return false;
  }

  return true;
}

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('reg-email').value;
    const senha = document.getElementById('reg-senha').value;
    const confSenha = document.getElementById('conf-senha').value;

    if (!validateRegisterForm()) return;

    showMessage('Criando conta...', true);

    try {
      const response = await fetch(`${backendUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ nome, email, senha })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('Conta criada com sucesso! Faça login.', true);
        registerForm.reset();
      } else {
        showMessage(data.error || 'Erro ao criar conta. Tente novamente.', false);
      }
    } catch (error) {
      showMessage('Erro na conexão com o servidor. Tente novamente.', false);
    }
  });
}