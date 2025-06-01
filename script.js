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
    
    // Verificar se usuário está logado (simulação)
    function checkLoginStatus() {
      // Na implementação real, verificar token no localStorage
      const isLoggedIn = false; // Altere para true para simular usuário logado
      
      if (isLoggedIn) {
        showLoggedInState();
      } else {
        showLoggedOutState();
      }
    }
    
    // Mostrar estado logado
    function showLoggedInState() {
      loginForm.classList.add('hidden');
      registerForm.classList.add('hidden');
      logoutBtn.classList.remove('hidden');
      userInfo.classList.remove('hidden');
      
      // Simulação de dados do usuário
      userName.textContent = 'Carlos Silva';
      userEmail.textContent = 'carlos.silva@exemplo.com';
    }
    
    // Mostrar estado não logado
    function showLoggedOutState() {
      loginForm.classList.remove('hidden');
      registerForm.classList.add('hidden');
      logoutBtn.classList.add('hidden');
      userInfo.classList.add('hidden');
      clearMessage();
    }
    
    // Alternar entre login e cadastro
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
    
    // Simular login
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (!validateLoginForm()) return;
      
      // Simulação de requisição
      showMessage('Autenticando...', true);
      
      setTimeout(() => {
        // Em uma implementação real, aqui seria feita a requisição ao backend
        // fetch(`${backendUrl}/login`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     email: document.getElementById('email').value,
        //     password: document.getElementById('senha').value
        //   })
        // })
        // .then(response => response.json())
        // .then(data => {
        //   if (data.success) {
        //     // Armazenar token e informações do usuário
        //     localStorage.setItem('token', data.token);
        //     showLoggedInState();
        //     showMessage('Login realizado com sucesso!', true);
        //   } else {
        //     showMessage(data.message || 'Credenciais inválidas', false);
        //   }
        // })
        // .catch(error => {
        //   showMessage('Erro na conexão com o servidor', false);
        // });
        
        // Simulação de login bem-sucedido
        showLoggedInState();
        showMessage('Login realizado com sucesso! Bem-vindo!', true);
      }, 1500);
    });
    
    // Simular cadastro
    registerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      if (!validateRegisterForm()) return;
      
      // Simulação de requisição
      showMessage('Criando conta...', true);
      
      setTimeout(() => {
        // Em uma implementação real:
        // fetch(`${backendUrl}/register`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     name: document.getElementById('nome').value,
        //     email: document.getElementById('reg-email').value,
        //     password: document.getElementById('reg-senha').value
        //   })
        // })
        // .then(response => response.json())
        // .then(data => {
        //   if (data.success) {
        //     showMessage('Conta criada com sucesso! Faça login.', true);
        //     toggleToLogin.click();
        //   } else {
        //     showMessage(data.message || 'Erro ao criar conta', false);
        //   }
        // })
        // .catch(error => {
        //   showMessage('Erro na conexão com o servidor', false);
        // });
        
        // Simulação de cadastro bem-sucedido
        showMessage('Conta criada com sucesso! Faça login.', true);
        toggleToLogin.click();
      }, 1500);
    });
    
    // Logout
    logoutBtn.addEventListener('click', () => {
      // Em implementação real:
      // localStorage.removeItem('token');
      // localStorage.removeItem('user');
      
      showLoggedOutState();
      showMessage('Você saiu da sua conta.', true);
    });
    
    // Inicializar
    checkLoginStatus();
    
    // Simular preenchimento automático para demonstração
    document.getElementById('email').value = 'usuario@exemplo.com';
    document.getElementById('senha').value = 'senha123';
    document.getElementById('nome').value = 'Carlos Silva';
    document.getElementById('reg-email').value = 'novo@usuario.com';
    document.getElementById('reg-senha').value = 'senha123';
    document.getElementById('conf-senha').value = 'senha123';