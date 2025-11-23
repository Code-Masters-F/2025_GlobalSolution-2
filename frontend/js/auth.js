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

      // Register elements
      this.elements.registerForm = document.querySelector('#modal-register .register-form');
      this.elements.regNameInput = document.querySelector('#modal-register input[type="text"]');
      this.elements.regEmailInput = document.querySelector('#modal-register input[type="email"]');
      this.elements.regPasswordInput = document.querySelector('#modal-register input[type="password"]');
      this.elements.regSubmitBtn = document.querySelector('#modal-register .btn--primary');
    },

    /**
     * Anexa event listeners
     */
    attachEventListeners() {
      if (this.elements.loginForm) {
        this.elements.loginForm.addEventListener('submit', (e) => this.handleSubmit(e, 'login'));
      }
      if (this.elements.registerForm) {
        this.elements.registerForm.addEventListener('submit', (e) => this.handleSubmit(e, 'register'));
      }

      // Switch buttons
      document.querySelectorAll('.auth-switch a').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const target = e.target.dataset.switch;
          this.switchModal(target);
        });
      });
    },

    switchModal(target) {
      if (window.ModalSystem) {
        window.ModalSystem.close();
        setTimeout(() => {
          const modalId = target === 'register' ? 'modal-register' : 'modal-login';
          const modal = document.getElementById(modalId);
          if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
        }, 300);
      }
    },

    /**
     * Processa submit do formulário
     */
    async handleSubmit(e, type) {
      e.preventDefault();

      const isLogin = type === 'login';
      const email = isLogin ? this.elements.emailInput?.value?.trim() : this.elements.regEmailInput?.value?.trim();
      const password = isLogin ? this.elements.passwordInput?.value : this.elements.regPasswordInput?.value;
      const name = isLogin ? null : this.elements.regNameInput?.value?.trim();

      if (!email || !password || (!isLogin && !name)) {
        this.showError('Preencha todos os campos', type);
        return;
      }

      const btn = isLogin ? this.elements.submitBtn : this.elements.regSubmitBtn;
      const originalText = btn.textContent;

      // Desabilita botão
      if (btn) {
        btn.disabled = true;
        btn.textContent = isLogin ? 'Entrando...' : 'Cadastrando...';
      }

      try {
        let result;
        if (isLogin) {
          result = await window.UserService.login(email, password);
        } else {
          result = await window.UserService.register(name, email, password);
        }

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
          this.showWelcome(result.user.name, !isLogin);
        } else {
          this.showError(result.error, type);
        }
      } catch (error) {
        this.showError('Erro ao processar solicitação. Tente novamente.', type);
        console.error('Auth error:', error);
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
      }
    },

    /**
     * Exibe mensagem de erro
     */
    showError(message, type = 'login') {
      const form = type === 'login' ? this.elements.loginForm : this.elements.registerForm;
      if (!form) return;

      let errorMsg = form.querySelector('.login-error');

      // Cria elemento de erro se não existir
      if (!errorMsg) {
        errorMsg = document.createElement('p');
        errorMsg.className = 'login-error';
        errorMsg.style.cssText = 'color: var(--color-error, #ef4444); font-size: 0.875rem; margin-top: 0.5rem; text-align: center;';

        const btn = form.querySelector('.btn--primary');
        if (btn) {
          btn.parentNode.insertBefore(errorMsg, btn);
        }
      }

      errorMsg.textContent = message;
      errorMsg.style.display = 'block';
    },

    /**
     * Limpa mensagem de erro
     */
    clearError() {
      document.querySelectorAll('.login-error').forEach(el => el.style.display = 'none');
    },

    /**
     * Mostra mensagem de boas-vindas
     */
    showWelcome(name, isNew = false) {
      // Adiciona mensagem no chat
      if (window.chat) {
        const msg = isNew
          ? `Bem-vindo ao FocusWave, ${name}! Conta criada com sucesso. Como posso ajudar você a focar hoje?`
          : `Bem-vindo de volta, ${name}! Como posso ajudar você a focar hoje?`;
        window.chat.addMessage(msg, 'ai');
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
