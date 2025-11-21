/**
 * Music Service
 * Handles API communications for music data
 */

class MusicService {
    constructor() {
        this.API_URL = 'http://localhost:8080';
        this.USE_MOCK = true; // Set to false when backend is ready
    }

    /**
     * Fetch all available musics for the player
     * @returns {Promise<Array>} List of musics
     */
    async getAllMusics() {
        if (this.USE_MOCK) {
            return this.getMockPlaylist();
        }

        try {
            const response = await fetch(`${this.API_URL}/musics`);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching musics:', error);
            return this.getMockPlaylist(); // Fallback
        }
    }

    /**
     * Fetch music suggestions based on user goal
     * @param {string} goal - User's intention
     * @param {number|null} lastMusicId - ID of last played music
     * @returns {Promise<Array>} List of suggestions
     */
    async getSuggestions(goal, lastMusicId = null) {
        if (this.USE_MOCK) {
            return this.getMockSuggestions(goal);
        }

        try {
            const payload = {
                goal: goal,
                lastMusicId: lastMusicId ? parseInt(lastMusicId) : null
            };

            const response = await fetch(`${this.API_URL}/chat/suggestions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            return this.getMockSuggestions(goal); // Fallback
        }
    }

    // Mock Data Generators
    getMockPlaylist() {
        return Promise.resolve([
            { title: "Lo-Fi Focus", description: "Beats para concentração", url: "assets/music/lofi.mp3", category: "Foco" },
            { title: "Rain Sounds", description: "Sons de chuva relaxantes", url: "assets/music/rain.mp3", category: "Relax" },
            { title: "Classical Flow", description: "Piano suave", url: "assets/music/classical.mp3", category: "Estudo" }
        ]);
    }

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
            }, 500);
        });
    }
}

// Export singleton
window.MusicService = new MusicService();
