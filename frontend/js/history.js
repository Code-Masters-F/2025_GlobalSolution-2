/**
 * History System
 * Sistema de histórico de músicas tocadas
 */

(function () {
  'use strict';

  const HistorySystem = {
    history: [],
    maxPreviewItems: 3,

    elements: {
      preview: null,
      full: null,
      expandBtn: null,
      searchInput: null
    },

    /**
     * Inicializa o sistema de histórico
     */
    async init() {
      this.cacheElements();
      await this.loadHistory();
      this.attachEventListeners();
      this.render();
      console.log('📜 History System initialized');
    },

    /**
     * Cacheia elementos DOM
     */
    cacheElements() {
      this.elements.preview = document.getElementById('history-preview');
      this.elements.full = document.getElementById('history-full');
      this.elements.expandBtn = document.querySelector('.history__expand-btn');
      this.elements.searchInput = document.getElementById('history-search');
    },

    /**
     * Anexa event listeners
     */
    attachEventListeners() {
      if (this.elements.searchInput) {
        this.elements.searchInput.addEventListener('input', (e) => {
          this.filterHistory(e.target.value);
        });
      }
    },

    /**
     * Carrega histórico do serviço
     */
    async loadHistory() {
      if (window.HistoryService) {
        this.history = await window.HistoryService.getHistory();
      }
    },

    /**
     * Adiciona música ao histórico
     * @param {Object} music - Objeto da música
     */
    async addToHistory(music) {
      if (window.HistoryService) {
        const entry = await window.HistoryService.addToHistory(music);
        if (entry) {
          // Atualiza lista local para renderização imediata (otimista) ou recarrega
          // Vamos recarregar para garantir sincronia
          await this.loadHistory();
          this.render();
          console.log(`📜 Added to history: ${music.title}`);
        }
      }
    },

    /**
     * Renderiza histórico
     */
    render() {
      this.renderPreview();
      this.renderFull();
    },

    /**
     * Renderiza preview (primeiras 3 músicas)
     */
    renderPreview() {
      if (!this.elements.preview) return;

      const preview = this.history.slice(0, this.maxPreviewItems);

      if (preview.length === 0) {
        this.elements.preview.innerHTML = '<p class="history__empty">Nenhuma música tocada ainda</p>';
        if (this.elements.expandBtn) {
          this.elements.expandBtn.hidden = true;
        }
        return;
      }

      this.elements.preview.innerHTML = preview.map(item =>
        this.createHistoryItemHTML(item)
      ).join('');

      if (this.elements.expandBtn) {
        this.elements.expandBtn.hidden = this.history.length <= this.maxPreviewItems;
      }

      this.attachItemListeners();
    },

    /**
     * Renderiza lista completa
     */
    renderFull() {
      if (!this.elements.full) return;

      if (this.history.length === 0) {
        this.elements.full.innerHTML = '<p class="history__empty">Nenhuma música no histórico</p>';
        return;
      }

      this.elements.full.innerHTML = this.history.map(item =>
        this.createHistoryItemHTML(item)
      ).join('');

      this.attachItemListeners();
    },

    /**
     * Cria HTML de um item do histórico
     * @param {Object} item - Item do histórico
     * @returns {string} HTML string
     */
    createHistoryItemHTML(item) {
      const timeAgo = this.getTimeAgo(item.playedAt);

      return `
        <div class="history-item" data-music-id="${item.id}" data-url="${item.url || ''}" data-title="${item.title || ''}" data-category="${item.category || ''}">
          <div class="history-play-icon">
            <i data-lucide="play" style="width: 14px; height: 14px;"></i>
          </div>
          <div class="history-info">
            <span class="track-name">${item.title}</span>
            <span class="track-artist">${item.category || item.description || ''}</span>
          </div>
          <span class="track-time">${timeAgo}</span>
        </div>
      `;
    },

    /**
     * Anexa listeners aos itens
     */
    attachItemListeners() {
      // Clique no item inteiro (carrega música e toca)
      document.querySelectorAll('.history-item').forEach(item => {
        item.addEventListener('click', () => {
          const musicId = item.dataset.musicId;
          // Use loose equality to handle string/number id mismatch
          let music = this.history.find(m => m.id == musicId);

          // Fallback: se não encontrar no histórico, usa os dados do dataset
          if (!music || !music.url) {
            music = {
              id: musicId,
              title: item.dataset.title || 'Música',
              url: item.dataset.url,
              category: item.dataset.category || ''
            };
          }

          if (music && music.url && window.player) {
            if (typeof window.player.loadTrack === 'function') {
              window.player.loadTrack(music);
            } else {
              console.error('Player does not support loadTrack');
            }
          } else {
            console.warn('Music URL not found or player not initialized', { musicId, music });
          }
        });
      });

      // Recria ícones Lucide nos novos elementos
      if (window.lucide) {
        lucide.createIcons();
      }
    },

    /**
     * Filtra histórico por busca
     * @param {string} query - Termo de busca
     */
    filterHistory(query) {
      if (!query.trim()) {
        this.renderFull();
        return;
      }

      const filtered = this.history.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );

      if (filtered.length === 0) {
        this.elements.full.innerHTML = '<p class="history__empty">Nenhuma música encontrada</p>';
        return;
      }

      this.elements.full.innerHTML = filtered.map(item =>
        this.createHistoryItemHTML(item)
      ).join('');

      this.attachItemListeners();
    },

    /**
     * Calcula tempo relativo (ex: "5min atrás")
     * @param {number} timestamp - Timestamp em ms
     * @returns {string} Tempo relativo
     */
    getTimeAgo(timestamp) {
      const now = Date.now();
      const diff = now - timestamp;

      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'Agora';
      if (minutes < 60) return `${minutes}m`;
      if (hours < 24) return `${hours}h`;
      return `${days}d`;
    },
  };

  // Inicializa quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      HistorySystem.init();
    });
  } else {
    HistorySystem.init();
  }

  // Expõe API pública
  window.HistorySystem = HistorySystem;

})();