/**
 * Music Service
 * Handles API communications for music data
 */

class MusicService {
    constructor() {
        this.API_URL = 'http://localhost:8080/api';
        this.USE_MOCK = false; // Disabled mock to use real backend
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
     * @returns {Promise<Array>} List of suggestions
     */
    async getSuggestions(goal, lastMusicId) {
        if (this.USE_MOCK) {
            return this.getMockSuggestions(goal);
        }

        try {
            const payload = {
                goal: goal,
                lastMusicId: lastMusicId
            };

            // Updated endpoint to match user screenshot
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
            { title: "Lo-Fi Focus", description: "Beats para concentração", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", category: "Foco" },
            { title: "Rain Sounds", description: "Sons de chuva relaxantes", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", category: "Relax" },
            { title: "Classical Flow", description: "Piano suave", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", category: "Estudo" }
        ]);
    }

    getMockSuggestions(goal) {
        return new Promise(resolve => {
            setTimeout(() => {
                // Simulate filtering based on goal (simple mock logic)
                const allSuggestions = [
                    { id: 1, title: "Lo-Fi Study Beats", description: "Batidas calmas para foco intenso.", category: "Foco", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
                    { id: 2, title: "Nature Sounds", description: "Sons de chuva e floresta.", category: "Relax", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
                    { id: 3, title: "Deep Focus Alpha", description: "Ondas alpha para concentração.", category: "Foco", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
                    { id: 4, title: "Rock Classics", description: "Energia para o trabalho.", category: "Rock", url: "https://www.soundhelix.com/examples/mp3/SoundH    elix-Song-4.mp3" }
                ];

                let filtered = allSuggestions;
                if (goal && goal.toLowerCase().includes('rock')) {
                    filtered = allSuggestions.filter(m => m.category === 'Rock');
                } else if (goal && (goal.toLowerCase().includes('foco') || goal.toLowerCase().includes('estudo'))) {
                    filtered = allSuggestions.filter(m => m.category === 'Foco');
                }

                // Return random if no match or empty filter
                if (filtered.length === 0) filtered = [allSuggestions[0]];

                resolve(filtered);
            }, 500);
        });
    }
}

// Export singleton
window.MusicService = new MusicService();
