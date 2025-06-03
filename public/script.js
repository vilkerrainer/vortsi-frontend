const backendUrl = "https://vortsi-bakcend.vercel.app";

// Elementos DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const messageDiv = document.getElementById('message');
const authButtons = document.getElementById('auth-buttons');
const loggedUser = document.getElementById('logged-user');
const userDisplayName = document.getElementById('user-display-name');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');
const buyBtn = document.querySelector('.buy-btn');

// Observador de interseção para animações
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      
      // Atualiza o menu ativo
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

// Observar todas as seções
sections.forEach(section => {
  observer.observe(section);
});

// Navegação suave para links do menu
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    const headerHeight = document.querySelector('.main-header').offsetHeight;
    const targetPosition = targetSection.offsetTop - headerHeight;

    // Adiciona classe ativa
    navLinks.forEach(navLink => navLink.classList.remove('active'));
    this.classList.add('active');

    // Scroll suave
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});

// Verificar estado de login
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

// Estado logado
function showLoggedInState(userData) {
  if (authButtons) authButtons.classList.add('hidden');
  if (loggedUser) loggedUser.classList.remove('hidden');
  
  if (userDisplayName) userDisplayName.textContent = userData.nome;
  
  showMessage(`Bem-vindo, ${userData.nome}!`, true);
}

// Estado não logado
function showLoggedOutState() {
  if (authButtons) authButtons.classList.remove('hidden');
  if (loggedUser) loggedUser.classList.add('hidden');
  
  clearMessage();
}

// Mostrar mensagem
function showMessage(text, isSuccess) {
  if (messageDiv) {
    messageDiv.textContent = text;
    messageDiv.className = isSuccess ? 'success show' : 'error show';
    
    setTimeout(() => {
      messageDiv.classList.remove('show');
      setTimeout(() => {
        clearMessage();
      }, 300);
    }, 5000);
  }
}

// Limpar mensagens
function clearMessage() {
  if (messageDiv) {
    messageDiv.textContent = '';
    messageDiv.className = '';
  }
}

// Validações
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

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

// Event Listeners
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
        showMessage('Login realizado com sucesso! Redirecionando...', true);
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1500);
      } else {
        showMessage(data.error || 'Erro no login. Verifique suas credenciais.', false);
      }
    } catch (error) {
      showMessage('Erro na conexão com o servidor. Tente novamente.', false);
    }
  });
}

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
        document.getElementById('nome').value = '';
        document.getElementById('reg-email').value = '';
        document.getElementById('reg-senha').value = '';
        document.getElementById('conf-senha').value = '';
      } else {
        showMessage(data.error || 'Erro ao criar conta. Tente novamente.', false);
      }
    } catch (error) {
      showMessage('Erro na conexão com o servidor. Tente novamente.', false);
    }
  });
}

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

if (buyBtn) {
  buyBtn.addEventListener('click', () => {
    showMessage('Redirecionando para página de pagamento...', true);
    // Adicione aqui a lógica de redirecionamento para o pagamento
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  checkLoginStatus();
  
  // Ativar primeira seção
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.classList.add('active');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === window.location.hash) {
          link.classList.add('active');
        }
      });
    }
  } else {
    sections[0].classList.add('active');
    navLinks[0].classList.add('active');
  }
});