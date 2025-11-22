/**
 * User Service
 * Gerencia autenticação e dados do usuário
 * Usa localStorage para persistir sessão (simulação básica)
 */

class UserService {
  constructor() {
    this.STORAGE_KEY = 'focuswave_user';
    this.currentUser = null;
    this.init();
  }

  /**
   * Inicializa o serviço carregando usuário salvo
   */
  init() {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        console.log('User session restored:', this.currentUser.name);
      } catch (e) {
        this.currentUser = null;
      }
    }
  }

  /**
   * Verifica se há usuário logado
   */
  isLoggedIn() {
    return this.currentUser !== null;
  }

  /**
   * Retorna usuário atual
   */
  getUser() {
    return this.currentUser;
  }

  /**
   * Retorna ID do usuário (ou 1 como padrão)
   */
  getUserId() {
    return this.currentUser?.id || 1;
  }

  /**
   * Login simples (simula autenticação)
   * Em produção, isso faria uma chamada para o backend
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    // Usuários de demonstração (mesmos do banco de dados)
    const demoUsers = [
      { id: 1, name: 'Lucas Silva', email: 'lucas@email.com', password: 'senha123' },
      { id: 2, name: 'Mariana Costa', email: 'mariana@email.com', password: 'senha123' },
      { id: 3, name: 'Pedro Alencar', email: 'pedro@email.com', password: 'senha123' }
    ];

    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = demoUsers.find(u =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
    );

    if (user) {
      this.currentUser = {
        id: user.id,
        name: user.name,
        email: user.email
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.currentUser));

      // Atualiza HistoryService com novo userId
      if (window.HistoryService) {
        window.HistoryService.setUserId(user.id);
      }

      return { success: true, user: this.currentUser };
    }

    return { success: false, error: 'Email ou senha incorretos' };
  }

  /**
   * Logout
   */
  logout() {
    this.currentUser = null;
    localStorage.removeItem(this.STORAGE_KEY);

    // Reseta para usuário padrão
    if (window.HistoryService) {
      window.HistoryService.setUserId(1);
    }
  }
}

// Export singleton
window.UserService = new UserService();
