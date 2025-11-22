/**
 * Auth Controller
 * Gerencia a interface de autenticação (login modal)
 */

(function () {
  'use strict';

  const AuthController = {
    elements: {
      loginForm: null,
      emailInput: null,
      passwordInput: null,
      submitBtn: null,
      userBtn: null,
      errorMsg: null
    },

    /**
     * Inicializa o controlador
     */
    init() {
      this.cacheElements();
      this.attachEventListeners();
      this.updateUI();
      console.log('Auth Controller initialized');
    },

    /**
     * Cacheia elementos DOM
     */
    cacheElements() {
      this.elements.loginForm = document.querySelector('#modal-login .login-form');
      this.elements.emailInput = document.querySelector('#modal-login input[type="email"]');
      this.elements.passwordInput = document.querySelector('#modal-login input[type="password"]');
      this.elements.submitBtn = document.querySelector('#modal-login .btn--primary');
      this.elements.userBtn = document.querySelector('[data-modal="login"]');
    },

    /**
     * Anexa event listeners
     */
    attachEventListeners() {
      if (this.elements.loginForm) {
        this.elements.loginForm.addEventListener('submit', (e) => this.handleSubmit(e));
      }
    },

    /**
     * Processa submit do formulário
     */
    async handleSubmit(e) {
      e.preventDefault();

      const email = this.elements.emailInput?.value?.trim();
      const password = this.elements.passwordInput?.value;

      if (!email || !password) {
        this.showError('Preencha todos os campos');
        return;
      }

      // Desabilita botão durante login
      if (this.elements.submitBtn) {
        this.elements.submitBtn.disabled = true;
        this.elements.submitBtn.textContent = 'Entrando...';
      }

      try {
        const result = await window.UserService.login(email, password);

        if (result.success) {
          this.clearError();
          this.updateUI();

          // Fecha modal
          if (window.ModalSystem) {
            window.ModalSystem.close();
          }

          // Recarrega histórico com novo usuário
          if (window.HistorySystem) {
            await window.HistorySystem.loadHistory();
            window.HistorySystem.render();
          }

          // Feedback visual
          this.showWelcome(result.user.name);
        } else {
          this.showError(result.error);
        }
      } catch (error) {
        this.showError('Erro ao fazer login. Tente novamente.');
        console.error('Login error:', error);
      } finally {
        if (this.elements.submitBtn) {
          this.elements.submitBtn.disabled = false;
          this.elements.submitBtn.textContent = 'Entrar';
        }
      }
    },

    /**
     * Exibe mensagem de erro
     */
    showError(message) {
      // Cria elemento de erro se não existir
      if (!this.elements.errorMsg) {
        this.elements.errorMsg = document.createElement('p');
        this.elements.errorMsg.className = 'login-error';
        this.elements.errorMsg.style.cssText = 'color: var(--color-error, #ef4444); font-size: 0.875rem; margin-top: 0.5rem; text-align: center;';

        if (this.elements.submitBtn) {
          this.elements.submitBtn.parentNode.insertBefore(this.elements.errorMsg, this.elements.submitBtn);
        }
      }

      this.elements.errorMsg.textContent = message;
      this.elements.errorMsg.style.display = 'block';
    },

    /**
     * Limpa mensagem de erro
     */
    clearError() {
      if (this.elements.errorMsg) {
        this.elements.errorMsg.style.display = 'none';
      }
    },

    /**
     * Mostra mensagem de boas-vindas
     */
    showWelcome(name) {
      // Adiciona mensagem no chat
      if (window.chat) {
        window.chat.addMessage(`Bem-vindo de volta, ${name}! Como posso ajudar você a focar hoje?`, 'ai');
      }
    },

    /**
     * Atualiza UI baseado no estado de login
     */
    updateUI() {
      const isLoggedIn = window.UserService?.isLoggedIn();
      const user = window.UserService?.getUser();

      if (this.elements.userBtn) {
        if (isLoggedIn && user) {
          // Muda ícone para indicar usuário logado
          this.elements.userBtn.innerHTML = '<i data-lucide="user-check"></i>';
          this.elements.userBtn.title = `Logado como ${user.name}`;
          this.elements.userBtn.setAttribute('aria-label', `Logado como ${user.name}`);

          // Muda ação do botão para logout
          this.elements.userBtn.removeAttribute('data-modal');
          this.elements.userBtn.onclick = () => this.handleLogout();
        } else {
          // Estado padrão (não logado)
          this.elements.userBtn.innerHTML = '<i data-lucide="user"></i>';
          this.elements.userBtn.title = 'Login';
          this.elements.userBtn.setAttribute('aria-label', 'Login');
          this.elements.userBtn.setAttribute('data-modal', 'login');
          this.elements.userBtn.onclick = null;
        }

        // Recria ícones Lucide
        if (window.lucide) {
          lucide.createIcons();
        }
      }
    },

    /**
     * Processa logout
     */
    handleLogout() {
      if (window.UserService) {
        window.UserService.logout();
        this.updateUI();

        // Recarrega histórico
        if (window.HistorySystem) {
          window.HistorySystem.loadHistory().then(() => {
            window.HistorySystem.render();
          });
        }

        // Feedback no chat
        if (window.chat) {
          window.chat.addMessage('Você saiu da sua conta. Até a próxima!', 'ai');
        }
      }
    }
  };

  // Inicializa quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AuthController.init());
  } else {
    AuthController.init();
  }

  // Expõe API pública
  window.AuthController = AuthController;

})();
