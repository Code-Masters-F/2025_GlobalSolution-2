/**
 * History Service
 * Handles API communications for music history
 * Integrates with backend and uses localStorage as fallback
 */

class HistoryService {
  constructor() {
    this.API_URL = 'http://localhost:8080/api';
    this.STORAGE_KEY = 'focuswave_history';
    this.USER_KEY = 'focuswave_user_id';
  }

  /**
   * Get current user ID (from UserService or localStorage fallback)
   */
  getUserId() {
    // Tenta pegar do UserService primeiro
    if (window.UserService && window.UserService.isLoggedIn()) {
      return window.UserService.getUserId();
    }
    // Fallback para localStorage
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? parseInt(stored) : 1; // Default user ID = 1
  }

  /**
   * Set user ID
   */
  setUserId(userId) {
    localStorage.setItem(this.USER_KEY, userId.toString());
  }

  /**
   * Get history items from backend
   * Falls back to localStorage if backend fails
   * @param {number} limit - Max items to return
   * @returns {Promise<Array>} List of history items
   */
  async getHistory(limit = 10) {
    const userId = this.getUserId();

    try {
      const response = await fetch(`${this.API_URL}/history/${userId}?limit=${limit}`);

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      // Transform backend response to frontend format
      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        url: item.url,
        category: item.category || '',
        playedAt: new Date(item.playedAt).getTime()
      }));
    } catch (error) {
      console.warn('Backend unavailable, using localStorage fallback:', error.message);
      return this.getLocalHistory();
    }
  }

  /**
   * Add item to history (backend + localStorage)
   * @param {Object} music Music object with id, title, etc
   * @returns {Promise<Object>} The added history item
   */
  async addToHistory(music) {
    const userId = this.getUserId();
    const musicId = parseInt(music.id) || 0;

    // Always save to localStorage first (immediate feedback)
    const localEntry = this.addToLocalHistory(music);

    // If music has a valid ID, also save to backend
    if (musicId > 0) {
      try {
        const response = await fetch(`${this.API_URL}/history/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            idUser: userId,
            idMusic: musicId
          })
        });

        if (!response.ok) {
          console.warn('Failed to register history on backend');
        }
      } catch (error) {
        console.warn('Backend unavailable for history:', error.message);
      }
    }

    return localEntry;
  }

  /**
   * Get history from localStorage (fallback)
   */
  getLocalHistory() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error reading local history:', e);
      return [];
    }
  }

  /**
   * Add to localStorage history
   */
  addToLocalHistory(music) {
    try {
      let history = this.getLocalHistory();

      const entry = {
        ...music,
        playedAt: Date.now(),
        historyId: `${music.id || Date.now()}-${Date.now()}`
      };

      history.unshift(entry);

      // Limit to 50 items
      if (history.length > 50) {
        history = history.slice(0, 50);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
      return entry;
    } catch (e) {
      console.error('Error saving local history:', e);
      return null;
    }
  }

  /**
   * Clear history (localStorage only)
   * @returns {Promise<boolean>} Success status
   */
  async clearHistory() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (e) {
      return false;
    }
  }
}

// Export singleton
window.HistoryService = new HistoryService();
