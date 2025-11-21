/**
 * History Service
 * Simulates backend interactions for history management
 */

class HistoryService {
  constructor() {
    this.STORAGE_KEY = 'focuswave_history';
    this.delay = 300; // Simulate network latency
  }

  /**
   * Get history items
   * @returns {Promise<Array>} List of history items
   */
  async getHistory() {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const stored = localStorage.getItem(this.STORAGE_KEY);
          const history = stored ? JSON.parse(stored) : [];
          resolve(history);
        } catch (e) {
          console.error('Error fetching history:', e);
          resolve([]);
        }
      }, this.delay);
    });
  }

  /**
   * Add item to history
   * @param {Object} music Music object
   * @returns {Promise<Object>} The added history item
   */
  async addToHistory(music) {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const stored = localStorage.getItem(this.STORAGE_KEY);
          let history = stored ? JSON.parse(stored) : [];

          const entry = {
            ...music,
            playedAt: Date.now(),
            id: `${music.id || Date.now()}-${Date.now()}` // Unique ID for history entry
          };

          // Add to beginning
          history.unshift(entry);

          // Limit to 50 items
          if (history.length > 50) {
            history = history.slice(0, 50);
          }

          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
          resolve(entry);
        } catch (e) {
          console.error('Error saving history:', e);
          resolve(null);
        }
      }, this.delay);
    });
  }

  /**
   * Clear history
   * @returns {Promise<boolean>} Success status
   */
  async clearHistory() {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          localStorage.removeItem(this.STORAGE_KEY);
          resolve(true);
        } catch (e) {
          resolve(false);
        }
      }, this.delay);
    });
  }
}

// Export singleton
window.HistoryService = new HistoryService();
