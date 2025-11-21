class PlayerController {
  constructor() {
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.tracks = []; // Will be populated by MusicService

    // DOM Elements
    this.playBtn = document.getElementById('player-play');
    this.prevBtn = document.getElementById('player-prev');
    this.nextBtn = document.getElementById('player-next');
    this.titleDisplay = document.getElementById('player-title');
    this.descDisplay = document.getElementById('player-description');
    this.volumeBar = document.querySelector('.volume-bar');

    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadPlaylist();
  }

  async loadPlaylist() {
    if (window.MusicService) {
      try {
        const musics = await window.MusicService.getAllMusics();
        if (musics && musics.length > 0) {
          this.tracks = musics;
          this.updateDisplay();
          this.enableControls();
        }
      } catch (error) {
        console.error('Failed to load playlist:', error);
        this.titleDisplay.textContent = "Erro ao carregar";
      }
    }
  }

  setupEventListeners() {
    this.playBtn?.addEventListener('click', () => this.togglePlay());
    this.prevBtn?.addEventListener('click', () => this.prevTrack());
    this.nextBtn?.addEventListener('click', () => this.nextTrack());
  }

  enableControls() {
    if (this.playBtn) this.playBtn.disabled = false;
    if (this.prevBtn) this.prevBtn.disabled = false;
    if (this.nextBtn) this.nextBtn.disabled = false;
  }

  togglePlay() {
    if (this.tracks.length === 0) return;

    this.isPlaying = !this.isPlaying;
    this.updateControls();

    // Update icon
    if (this.playBtn) {
      this.playBtn.innerHTML = this.isPlaying
        ? '<i data-lucide="pause"></i>'
        : '<i data-lucide="play"></i>';

      if (window.lucide) lucide.createIcons();
    }

    // Add to history if playing
    if (this.isPlaying && window.HistorySystem) {
      const currentTrack = this.tracks[this.currentTrackIndex];
      window.HistorySystem.addToHistory(currentTrack);
    }
  }

  prevTrack() {
    if (this.tracks.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.updateDisplay();
    if (this.isPlaying) {
      // restart playing logic would go here
    }
  }

  nextTrack() {
    if (this.tracks.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.updateDisplay();
    if (this.isPlaying) {
      // restart playing logic would go here
    }
  }

  updateDisplay() {
    if (this.tracks.length === 0) return;

    const track = this.tracks[this.currentTrackIndex];
    if (this.titleDisplay) this.titleDisplay.textContent = track.title;
    if (this.descDisplay) this.descDisplay.textContent = track.description;
  }

  updateControls() {
    // Visual feedback for playing state
    if (this.playBtn) {
      this.playBtn.classList.toggle('playing', this.isPlaying);
    }
  }

  loadTrack(track) {
    // Check if track is already in the list
    let index = this.tracks.findIndex(t => t.title === track.title);

    if (index === -1) {
      // Add to tracks if not present
      this.tracks.push(track);
      index = this.tracks.length - 1;
    }

    this.currentTrackIndex = index;
    this.updateDisplay();
    this.enableControls();

    if (!this.isPlaying) {
      this.togglePlay();
    } else {
      // If already playing, just ensure history is updated if needed
      if (window.HistorySystem) {
        window.HistorySystem.addToHistory(track);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.player = new PlayerController();
});