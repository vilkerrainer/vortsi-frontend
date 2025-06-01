// const backendUrl = "https://vortsi-backend.onrender.com";

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
function checkLoginStatus() {
  const userData = localStorage.getItem('userData');
  
  if (userData) {
    try {
      const parsedData = JSON.parse(userData);
      showLoggedInState(parsedData);
      return true;
    } catch (e) {
      console.error('Erro ao analisar dados do usuário:', e);
    }
  }
  
  showLoggedOutState();
  return false;
}

// Mostrar estado logado
function showLoggedInState(userData) {
  loginForm.classList.add('hidden');
  registerForm.classList.add('hidden');
  logoutBtn.classList.remove('hidden');
  userInfo.classList.remove('hidden');

  userName.textContent = userData.nome;
  userEmail.textContent = userData.email;
}

// Mostrar estado não logado
function showLoggedOutState() {
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  logoutBtn.classList.add('hidden');
  userInfo.classList.add('hidden');
  clearMessage();
  
  // Limpar campos de login
  document.getElementById('email').value = '';
  document.getElementById('senha').value = '';
}

// Limpar mensagens
function clearMessage() {
  messageDiv.textContent = '';
  messageDiv.className = '';
}

// Mostrar mensagem
function showMessage(text, isSuccess) {
  messageDiv.textContent = text;
  messageDiv.className = isSuccess ? 'success' : 'error';
}

// Validação de formulário
function validateLoginForm() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

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
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('reg-email').value;
  const senha = document.getElementById('reg-senha').value;
  const confSenha = document.getElementById('conf-senha').value;

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
loginBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  if (!validateLoginForm()) return;

  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  showMessage('Autenticando...', true);

  try {
    const response = await fetch(`${"https://vortsi-backend.onrender.com"}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();

    if (response.ok) {
      // Salvar dados do usuário no localStorage
      const userData = {
        nome: data.nome,
        email: data.email,
        pago: data.pago
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      
      showLoggedInState(userData);
      showMessage('Login realizado com sucesso! Bem-vindo!', true);
    } else {
      showMessage(data.error || 'Erro no login. Verifique suas credenciais.', false);
    }
  } catch (error) {
    showMessage('Erro na conexão com o servidor. Tente novamente.', false);
  }
});

// Cadastro
registerBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  if (!validateRegisterForm()) return;

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('reg-email').value;
  const senha = document.getElementById('reg-senha').value;

  showMessage('Criando conta...', true);

  try {
    const response = await fetch(`${"https://vortsi-backend.onrender.com"}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
      toggleToLogin.click();
    } else {
      showMessage(data.error || 'Erro ao criar conta. Tente novamente.', false);
    }
  } catch (error) {
    showMessage('Erro na conexão com o servidor. Tente novamente.', false);
  }
});

// Logout
logoutBtn.addEventListener('click', async () => {
  try {
    const response = await fetch(`${"https://vortsi-backend.onrender.com"}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      // Limpar dados do usuário
      localStorage.removeItem('userData');
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

// Eventos de alternância
toggleToRegister.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  registerForm.classList.remove('hidden');
  clearMessage();
});

toggleToLogin.addEventListener('click', () => {
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  clearMessage();
});

// Inicialização
checkLoginStatus();