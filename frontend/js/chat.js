class ChatController {
  constructor() {
    this.messagesContainer = document.getElementById('chat-messages');
    this.chatForm = document.getElementById('chat-form');
    this.chatInput = document.getElementById('chat-input');
    this.quickActions = document.querySelectorAll('.chip');

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
          this.handleAnotherMusic(target.dataset.goal);
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

  async processResponse(userMessage) {
    this.showTypingIndicator();

    try {
      // Use ChatService to fetch suggestions
      const suggestions = await this.fetchSuggestions(userMessage);
      this.removeTypingIndicator();

      if (suggestions && suggestions.length > 0) {
        // Simulate LLM response
        const intro = this.getLLMIntro(userMessage, suggestions.length);
        this.addMessage(intro, 'ai');

        // Render first suggestion as a card
        const music = suggestions[0];
        this.renderMusicCard(music, userMessage);

        // Update timer mode based on context
        this.updateTimerMode(userMessage);
      } else {
        this.addMessage("Não encontrei músicas específicas para isso no momento. Que tal tentar 'foco' ou 'rock'?", 'ai');
      }

    } catch (error) {
      console.error('Error fetching suggestions:', error);
      this.removeTypingIndicator();
      this.addMessage("Desculpe, tive um problema ao conectar com minha inteligência musical. Tente novamente.", 'ai');
    }
  }

  getLLMIntro(userMessage, count) {
    const lowerMsg = userMessage.toLowerCase();
    if (lowerMsg.includes('rock')) return `Encontrei ${count} músicas de Rock para energizar seu dia! Aqui está uma sugestão:`;
    if (lowerMsg.includes('foco')) return `Para ajudar no seu foco, selecionei ${count} faixas especiais. Comece com esta:`;
    if (lowerMsg.includes('relax')) return `Hora de relaxar. Encontrei ${count} músicas tranquilas para você:`;
    return `Entendi! Com base no seu pedido, encontrei ${count} músicas que podem combinar. Confira:`;
  }

  async fetchSuggestions(goal, lastMusicId) {
    if (window.MusicService) {
      return await window.MusicService.getSuggestions(goal, lastMusicId);
    } else {
      console.error('MusicService not found');
      return [];
    }
  }

  renderMusicCard(music, originalGoal) {
    const cardHtml = `
      <div class="music-suggestion-card">
        <div class="glass-card p-4 mt-3 mb-2" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h4 class="font-bold text-lg text-white">${music.title}</h4>
              <p class="text-sm text-gray-400">${music.description || music.category}</p>
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
      }
    }
  }

  handleAnotherMusic(goal) {
    this.processResponse(goal);
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
}

document.addEventListener('DOMContentLoaded', () => {
  window.chat = new ChatController();
});