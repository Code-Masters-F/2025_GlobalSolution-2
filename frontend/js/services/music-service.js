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
                    { id: 1, title: "Chuva Binaural", description: "Som de chuva com frequências binaurais para foco e estudo.", category: "Foco", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
                    { id: 2, title: "Sons de Tigela", description: "Vibrações sonoras de tigelas tibetanas para meditação profunda.", category: "Meditação", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
                    { id: 3, title: "Canto dos Pássaros", description: "Som ambiente de pássaros na floresta para relaxamento.", category: "Natureza", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
                    { id: 4, title: "Viagem de Trem", description: "Ambiente sonoro de uma viagem tranquila de trem.", category: "ASMR", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
                    { id: 5, title: "Dança do Dragão", description: "Música tradicional festiva chinesa.", category: "Cultura", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" }
                ];

                const g = (goal || '').toLowerCase();
                let filtered = allSuggestions;

                // Filtra por categoria baseado no goal
                if (g.includes('foco') || g.includes('estudar') || g.includes('concentrar') || g.includes('profundo')) {
                    filtered = allSuggestions.filter(m => m.category === 'Foco');
                } else if (g.includes('relaxar') || g.includes('meditar') || g.includes('calmo') || g.includes('paz')) {
                    filtered = allSuggestions.filter(m => m.category === 'Meditação');
                } else if (g.includes('natureza') || g.includes('floresta') || g.includes('pássaro')) {
                    filtered = allSuggestions.filter(m => m.category === 'Natureza');
                } else if (g.includes('dormir') || g.includes('sono') || g.includes('asmr') || g.includes('trem')) {
                    filtered = allSuggestions.filter(m => m.category === 'ASMR');
                } else if (g.includes('cultura') || g.includes('oriental') || g.includes('chinês')) {
                    filtered = allSuggestions.filter(m => m.category === 'Cultura');
                }

                // Se não encontrou nada específico, embaralha e pega uma aleatória
                if (filtered.length === 0) {
                    filtered = allSuggestions;
                }

                // Embaralha e retorna apenas 1 música
                filtered.sort(() => Math.random() - 0.5);
                resolve([filtered[0]]);
            }, 500);
        });
    }
}

// Export singleton
window.MusicService = new MusicService();
