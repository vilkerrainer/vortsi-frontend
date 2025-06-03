const backendUrl = "https://vortsi-bakcend.vercel.app";

// Elementos DOM
const logoutBtn = document.getElementById('logout-btn');
const loggedUser = document.getElementById('logged-user');
const userDisplayName = document.getElementById('user-display-name');
const authButtons = document.getElementById('auth-buttons');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.main-section');
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
      // Armazena os dados do usuário no localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
      showLoggedInState(userData);
      return true;
    } else if (response.status === 401) {
      localStorage.removeItem('userData');
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
  if (!userData) {
    // Tenta recuperar do localStorage se não foi passado
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      userData = JSON.parse(storedUser);
    } else {
      showLoggedOutState();
      return;
    }
  }

  if (authButtons) authButtons.classList.add('hidden');
  if (loggedUser) {
    loggedUser.classList.remove('hidden');
    if (userDisplayName) {
      userDisplayName.textContent = userData.nome || 'Usuário';
    }
  }
}

// Estado não logado
function showLoggedOutState() {
  if (authButtons) authButtons.classList.remove('hidden');
  if (loggedUser) loggedUser.classList.add('hidden');
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
        // Remove os dados do usuário do localStorage
        localStorage.removeItem('userData');
        showLoggedOutState();
        // Redireciona para a página inicial se não estiver nela
        if (!window.location.href.includes('/public/index.html')) {
          window.location.href = '/public/index.html';
        }
      } else {
        const data = await response.json();
        console.error(data.error || 'Erro ao sair');
      }
    } catch (error) {
      console.error('Erro na conexão com o servidor', error);
    }
  });
}

if (buyBtn) {
  buyBtn.addEventListener('click', () => {
    console.log('Redirecionando para página de pagamento...');
    // Adicione aqui a lógica de redirecionamento para o pagamento
  });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Verifica o status de login ao carregar a página
  checkLoginStatus().then(isLoggedIn => {
    if (isLoggedIn) {
      // Se estiver logado, mostra os dados do usuário
      const userData = JSON.parse(localStorage.getItem('userData')) || {};
      showLoggedInState(userData);
    }
  });
  
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
    sections[0]?.classList.add('active');
    navLinks[0]?.classList.add('active');
  }
});