class ChatController {
  constructor() {
    this.messagesContainer = document.getElementById('chat-messages');
    this.chatForm = document.getElementById('chat-form');
    this.chatInput = document.getElementById('chat-input');
    this.quickActions = document.querySelectorAll('.chip');

    // Configuration
    this.API_URL = 'http://localhost:8080/chat/suggestions';
    this.USE_MOCK = true; // Set to false when backend is ready

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.scrollToBottom();
  }

  setupEventListeners() {
    if (this.chatForm) {
      this.chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    this.quickActions.forEach(btn => {
      btn.addEventListener('click', () => {
        const message = btn.dataset.message;
        this.addMessage(message, 'user');
        this.processResponse(message);
      });
    });

    // Event delegation for dynamic buttons (Play, Another Song)
    if (this.messagesContainer) {
      this.messagesContainer.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;

        if (target.classList.contains('btn-play-music')) {
          this.handlePlayMusic(target.dataset);
        } else if (target.classList.contains('btn-another-music')) {
          this.handleAnotherMusic(target.dataset.goal, target.dataset.lastId);
        }
      });
    }
  }

  handleSubmit() {
    if (!this.chatInput) return;

    const message = this.chatInput.value.trim();
    if (!message) return;

    this.addMessage(message, 'user');
    this.chatInput.value = '';
    this.processResponse(message);
  }

  addMessage(text, sender, isHtml = false) {
    if (!this.messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message message--${sender}`;

    const contentHtml = isHtml ? text : `<p>${text}</p>`;

    messageDiv.innerHTML = `
      <div class="message__content">
        ${contentHtml}
      </div>
    `;

    this.messagesContainer.appendChild(messageDiv);
    this.scrollToBottom();

    if (window.lucide) lucide.createIcons();
  }

  async processResponse(userMessage, lastMusicId = null) {
    this.showTypingIndicator();

    try {
      const suggestions = await this.fetchSuggestions(userMessage, lastMusicId);
      this.removeTypingIndicator();

      if (suggestions && suggestions.length > 0) {
        const music = suggestions[0];
        this.renderMusicCard(music, userMessage);
        this.updateTimerMode(userMessage);
      } else {
        this.addMessage("Não encontrei sugestões específicas, mas tente 'foco' ou 'relaxar'.", 'ai');
      }

    } catch (error) {
      console.error('Error fetching suggestions:', error);
      this.removeTypingIndicator();
      this.addMessage("Desculpe, tive um problema ao conectar com minha inteligência musical. Tente novamente.", 'ai');
    }
  }

  async fetchSuggestions(goal, lastMusicId) {
    if (this.USE_MOCK) {
      return this.getMockSuggestions(goal);
    }

    const payload = {
      goal: goal,
      lastMusicId: lastMusicId ? parseInt(lastMusicId) : null
    };

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  }

  renderMusicCard(music, originalGoal) {
    const cardHtml = `
      <div class="music-suggestion-card">
        <p>Aqui está uma sugestão para você:</p>
        <div class="glass-card p-4 mt-3 mb-2" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h4 class="font-bold text-lg text-white">${music.title}</h4>
              <p class="text-sm text-gray-400">${music.description}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <i data-lucide="music" style="width:20px; height:20px;"></i>
            </div>
          </div>
          
          <div class="flex gap-3 mt-4">
            <button class="btn-play-music flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-4 rounded-full flex items-center justify-center gap-2 transition-all"
              data-title="${music.title}" 
              data-artist="${music.category}" 
              data-description="${music.description}"
              data-url="${music.url}">
              <i data-lucide="play" style="width:18px; height:18px; fill: currentColor;"></i>
              Tocar Agora
            </button>
            
            <button class="btn-another-music w-12 h-10 rounded-full border border-white/20 hover:bg-white/10 flex items-center justify-center text-white transition-all"
              data-goal="${originalGoal}" 
              data-last-id="${music.id}"
              title="Quero outra sugestão">
              <i data-lucide="refresh-cw" style="width:18px; height:18px;"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    this.addMessage(cardHtml, 'ai', true);
  }

  handlePlayMusic(data) {
    if (window.player) {
      const track = {
        title: data.title,
        description: data.description || data.artist,
        url: data.url
      };

      if (typeof window.player.loadTrack === 'function') {
        window.player.loadTrack(track);
      } else {
        console.error('Player does not support loadTrack');
        // Fallback
        const titleEl = document.getElementById('player-title');
        const descEl = document.getElementById('player-description');
        if (titleEl) titleEl.textContent = track.title;
        if (descEl) descEl.textContent = track.description;
      }
    }
  }

  handleAnotherMusic(goal, lastId) {
    this.processResponse(goal, lastId);
  }

  updateTimerMode(message) {
    if (!window.timer) return;
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('foco') || lowerMsg.includes('focar')) window.timer.setMode('focus');
    else if (lowerMsg.includes('relaxar')) window.timer.setMode('relax');
    else if (lowerMsg.includes('música')) window.timer.setMode('music');
  }

  showTypingIndicator() {
    if (!this.messagesContainer) return;
    const indicator = document.createElement('div');
    indicator.className = 'message message--ai typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `<div class="message__content"><p>...</p></div>`;
    this.messagesContainer.appendChild(indicator);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  // Mock Data Generator
  getMockSuggestions(goal) {
    return new Promise(resolve => {
      setTimeout(() => {
        const suggestions = [
          { id: 1, title: "Lo-Fi Study Beats", description: "Batidas calmas para foco intenso.", category: "Foco", url: "music1.mp3" },
          { id: 2, title: "Nature Sounds", description: "Sons de chuva e floresta.", category: "Relax", url: "music2.mp3" },
          { id: 3, title: "Deep Focus Alpha", description: "Ondas alpha para concentração.", category: "Foco", url: "music3.mp3" },
          { id: 4, title: "Piano Ambient", description: "Piano suave para leitura.", category: "Estudo", url: "music4.mp3" }
        ];

        const random = suggestions[Math.floor(Math.random() * suggestions.length)];
        resolve([random]);
      }, 1000);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.chat = new ChatController();
});