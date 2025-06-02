const backendUrl = "https://vortsi-backend.onrender.com";

// Elementos DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const toggleToRegister = document.getElementById('toggle-to-register');
const toggleToLogin = document.getElementById('toggle-to-login');
const messageDiv = document.getElementById('message');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const userEmail = document.getElementById('user-email');

// Verificar estado de login ao carregar
async function checkLoginStatus() {
  try {
    const response = await fetch(`${backendUrl}/check-session`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const userData = await response.json();
      showLoggedInState(userData);
      return true;
    } else if (response.status === 401) {
      showLoggedOutState();
      return false;
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    showLoggedOutState();
    return false;
  }
}

// Mostrar estado logado
function showLoggedInState(userData) {
  if (loginForm) loginForm.classList.add('hidden');
  if (registerForm) registerForm.classList.add('hidden');
  if (logoutBtn) logoutBtn.classList.remove('hidden');
  if (userInfo) userInfo.classList.remove('hidden');

  if (userName) userName.textContent = userData.nome;
  if (userEmail) userEmail.textContent = userData.email;
}

// Mostrar estado não logado
function showLoggedOutState() {
  if (loginForm) loginForm.classList.remove('hidden');
  if (registerForm) registerForm.classList.add('hidden');
  if (logoutBtn) logoutBtn.classList.add('hidden');
  if (userInfo) userInfo.classList.add('hidden');
  
  clearMessage();
  
  // Limpar campos de login
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  if (emailInput) emailInput.value = '';
  if (senhaInput) senhaInput.value = '';
}

// Limpar mensagens
function clearMessage() {
  if (messageDiv) {
    messageDiv.textContent = '';
    messageDiv.className = '';
  }
}

// Mostrar mensagem
function showMessage(text, isSuccess) {
  if (messageDiv) {
    messageDiv.textContent = text;
    messageDiv.className = isSuccess ? 'success' : 'error';
    
    // Auto-ocultar mensagens após 5 segundos
    if (text) {
      setTimeout(() => {
        clearMessage();
      }, 5000);
    }
  }
}

// Validação de formulário
function validateLoginForm() {
  const email = document.getElementById('email')?.value;
  const senha = document.getElementById('senha')?.value;

  if (!email || !senha) {
    showMessage('Por favor, preencha todos os campos.', false);
    return false;
  }

  if (!validateEmail(email)) {
    showMessage('Por favor, insira um email válido.', false);
    return false;
  }

  return true;
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

// Validação de email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Login
if (loginBtn) {
  loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!validateLoginForm()) return;

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    showMessage('Autenticando...', true);

    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (response.ok) {
        showLoggedInState(data);
        showMessage('Login realizado com sucesso! Bem-vindo!', true);
      } else {
        showMessage(data.error || 'Erro no login. Verifique suas credenciais.', false);
      }
    } catch (error) {
      showMessage('Erro na conexão com o servidor. Tente novamente.', false);
    }
  });
}

// Cadastro
if (registerBtn) {
  registerBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!validateRegisterForm()) return;

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('reg-email').value;
    const senha = document.getElementById('reg-senha').value;

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
        // Limpar o formulário de registro
        document.getElementById('nome').value = '';
        document.getElementById('reg-email').value = '';
        document.getElementById('reg-senha').value = '';
        document.getElementById('conf-senha').value = '';
        if (toggleToLogin) toggleToLogin.click();
      } else {
        showMessage(data.error || 'Erro ao criar conta. Tente novamente.', false);
      }
    } catch (error) {
      showMessage('Erro na conexão com o servidor. Tente novamente.', false);
    }
  });
}

// Logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      const response = await fetch(`${backendUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        showLoggedOutState();
        showMessage('Você saiu da sua conta.', true);
      } else {
        const data = await response.json();
        showMessage(data.error || 'Erro ao sair', false);
      }
    } catch (error) {
      showMessage('Erro na conexão com o servidor', false);
    }
  });
}

// Eventos de alternância
if (toggleToRegister) {
  toggleToRegister.addEventListener('click', () => {
    if (loginForm) loginForm.classList.add('hidden');
    if (registerForm) registerForm.classList.remove('hidden');
    clearMessage();
  });
}

if (toggleToLogin) {
  toggleToLogin.addEventListener('click', () => {
    if (registerForm) registerForm.classList.add('hidden');
    if (loginForm) loginForm.classList.remove('hidden');
    clearMessage();
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
});