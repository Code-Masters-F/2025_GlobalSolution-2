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
          this.handleAnotherMusic(target.dataset.goal, target.dataset.lastMusicId);
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

    if (window.lucide) {
      lucide.createIcons({
        attrs: {
          'stroke-width': '1.5'
        }
      });
    }
  }

  async processResponse(userMessage, lastMusicId = null) {
    this.showTypingIndicator();

    try {
      // Use ChatService to fetch suggestions
      const suggestions = await this.fetchSuggestions(userMessage, lastMusicId);
      this.removeTypingIndicator();

      if (suggestions && suggestions.length > 0) {
        // Simulate LLM response
        const intro = this.getLLMIntro(userMessage, suggestions.length);
        this.addMessage(intro, 'ai');

        // Render all suggestions as cards
        suggestions.forEach(music => {
          this.renderMusicCard(music, userMessage);
        });

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
    const msg = userMessage.toLowerCase();

    // Rock
    if (msg.includes('rock') || msg.includes('guitarra') || msg.includes('energia') || msg.includes('animado')) {
      const responses = [
        `Rock and Roll! Encontrei ${count} músicas para te dar energia. Começa com essa:`,
        `Hora de soltar a guitarra! Separei ${count} clássicos do rock pra você:`,
        `Energia no máximo! Tenho ${count} músicas de rock perfeitas para o momento:`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Pop
    if (msg.includes('pop') || msg.includes('hit') || msg.includes('dançar') || msg.includes('alegre') || msg.includes('feliz')) {
      const responses = [
        `Pop hits chegando! Encontrei ${count} músicas animadas pra você:`,
        `Hora de dançar! Selecionei ${count} hits pop especiais:`,
        `Música pra levantar o astral! Aqui estão ${count} opções:`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Bossa Nova / Relaxar
    if (msg.includes('bossa') || msg.includes('relaxar') || msg.includes('relax') || msg.includes('calmo') ||
      msg.includes('tranquilo') || msg.includes('descansar') || msg.includes('paz') || msg.includes('suave')) {
      const responses = [
        `Momento de paz... Separei ${count} músicas suaves pra você relaxar:`,
        `Hora de desacelerar. Encontrei ${count} faixas tranquilas:`,
        `Relaxa que a vida é boa! Tenho ${count} músicas calmas perfeitas:`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // MPB / Brasileiro
    if (msg.includes('mpb') || msg.includes('brasil') || msg.includes('brasileiro') || msg.includes('saudade')) {
      const responses = [
        `MPB de qualidade! Encontrei ${count} músicas brasileiras pra você:`,
        `Saudade do Brasil? Separei ${count} clássicos da MPB:`,
        `Música brasileira de primeira! Aqui estão ${count} opções:`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Clássica / Foco / Estudar
    if (msg.includes('foco') || msg.includes('focar') || msg.includes('estudar') || msg.includes('trabalhar') ||
      msg.includes('concentrar') || msg.includes('classica') || msg.includes('piano') || msg.includes('produtivo')) {
      const responses = [
        `Modo foco ativado! Selecionei ${count} músicas para concentração máxima:`,
        `Hora de produzir! Encontrei ${count} faixas perfeitas para estudar:`,
        `Concentração total! Tenho ${count} músicas clássicas para você focar:`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Metal
    if (msg.includes('metal') || msg.includes('heavy') || msg.includes('pesado') || msg.includes('intenso')) {
      const responses = [
        `Heavy Metal! Encontrei ${count} músicas pesadas pra você:`,
        `Intensidade no máximo! Separei ${count} faixas de metal:`,
        `Hora do peso! Aqui estão ${count} músicas pra headbang:`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Grunge / Anos 90
    if (msg.includes('grunge') || msg.includes('nirvana') || msg.includes('90') || msg.includes('alternativo')) {
      const responses = [
        `Voltando aos anos 90! Encontrei ${count} clássicos do grunge:`,
        `Nostalgia alternativa! Separei ${count} músicas da era grunge:`,
        `Seattle calling! Tenho ${count} faixas do melhor do grunge:`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Dormir
    if (msg.includes('dormir') || msg.includes('sono') || msg.includes('noite')) {
      const responses = [
        `Hora de descansar... Separei ${count} músicas relaxantes pra você:`,
        `Boa noite! Encontrei ${count} faixas suaves para embalar seu sono:`,
        `Relaxa e dorme bem! Aqui estão ${count} músicas calmas:`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Treino
    if (msg.includes('treino') || msg.includes('academia') || msg.includes('malhar') || msg.includes('exerc')) {
      const responses = [
        `Bora treinar! Encontrei ${count} músicas pra bombar seu treino:`,
        `Energia pro workout! Separei ${count} faixas motivacionais:`,
        `No pain, no gain! Tenho ${count} músicas pra te dar força:`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Saudação
    if (msg.includes('olá') || msg.includes('oi') || msg.includes('ola') || msg.includes('bom dia') ||
      msg.includes('boa tarde') || msg.includes('boa noite')) {
      const responses = [
        `Olá! Que bom te ver por aqui. Encontrei ${count} músicas que você pode gostar:`,
        `Oi! Pronto pra uma boa música? Tenho ${count} sugestões:`,
        `E aí! Separei ${count} músicas especiais pra você:`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Genérico / Fallback
    const fallbacks = [
      `Entendi seu pedido! Encontrei ${count} músicas que combinam. Confira:`,
      `Boa escolha! Separei ${count} músicas pra você:`,
      `Achei ${count} músicas que você vai curtir. Começa com essa:`,
      `Pronto! Tenho ${count} sugestões musicais pra você:`
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
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
    // Escapa aspas para evitar quebra do HTML
    const safeTitle = (music.title || '').replace(/"/g, '&quot;');
    const safeDesc = (music.description || '').replace(/"/g, '&quot;');
    const safeUrl = (music.url || '').replace(/"/g, '&quot;');
    const safeCategory = (music.category || '').replace(/"/g, '&quot;');

    const cardHtml = `
      <div class="music-suggestion-card">
        <div class="glass-card p-4 mt-3 mb-2" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);">
          <div class="flex items-center justify-between mb-3">
            <div>
              <h4 class="font-bold text-lg text-white">${music.title}</h4>
              <p class="text-sm text-gray-400">${music.description || music.category}</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <i data-lucide="music" style="width:10px; height:10px;"></i>
            </div>
          </div>

          <div class="flex gap-3 mt-4">
            <button class="btn-play-music flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-2 px-2 rounded-full flex items-center justify-center gap-2 transition-all"
              data-id="${music.id || ''}"
              data-title="${safeTitle}"
              data-category="${safeCategory}"
              data-description="${safeDesc}"
              data-url="${safeUrl}">
              <i data-lucide="play" style="width:18px; height:18px; fill: currentColor;"></i>
              Tocar Agora
            </button>

            <button class="btn-another-music w-12 h-10 rounded-full border border-white/20 hover:bg-white/10 flex items-center justify-center text-white transition-all"
              data-goal="${originalGoal}"
              data-last-music-id="${music.id || ''}"
              title="Trocar música">
              <i data-lucide="refresh-cw" style="width:18px; height:18px;"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    this.addMessage(cardHtml, 'ai', true);
  }

  handlePlayMusic(data) {
    console.log('handlePlayMusic data:', data);

    if (!data.url) {
      console.error('No URL in track data');
      return;
    }

    if (window.player) {
      const track = {
        id: data.id || null,
        title: data.title || 'Música',
        description: data.description || data.category || '',
        category: data.category || '',
        url: data.url
      };

      console.log('Sending track to player:', track);

      if (typeof window.player.loadTrack === 'function') {
        window.player.loadTrack(track);
      } else {
        console.error('Player does not support loadTrack');
      }
    } else {
      console.error('Player not found');
    }
  }

  handleAnotherMusic(goal, lastMusicId) {
    if (window.player && typeof window.player.stop === 'function') {
      window.player.stop();
    }
    this.processResponse(goal, lastMusicId);
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