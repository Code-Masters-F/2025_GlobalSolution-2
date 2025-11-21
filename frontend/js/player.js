class PlayerController {
  constructor() {
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.tracks = [
      { title: "Lo-Fi Focus", description: "Beats para concentração" },
      { title: "Rain Sounds", description: "Sons de chuva relaxantes" },
      { title: "Classical Flow", description: "Piano suave" }
    ];

    // DOM Elements
    this.playBtn = document.getElementById('player-play');
    this.prevBtn = document.getElementById('player-prev');
    this.nextBtn = document.getElementById('player-next');
    this.titleDisplay = document.getElementById('player-title');
    this.descDisplay = document.getElementById('player-description');
    this.volumeBar = document.querySelector('.volume-bar');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateDisplay();
  }

  setupEventListeners() {
    this.playBtn?.addEventListener('click', () => this.togglePlay());
    this.prevBtn?.addEventListener('click', () => this.prevTrack());
    this.nextBtn?.addEventListener('click', () => this.nextTrack());

    // Enable buttons
    if (this.playBtn) this.playBtn.disabled = false;
    if (this.prevBtn) this.prevBtn.disabled = false;
    if (this.nextBtn) this.nextBtn.disabled = false;
  }

  togglePlay() {
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
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.updateDisplay();
    if (this.isPlaying) {
      // restart playing
    }
  }

  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.updateDisplay();
    if (this.isPlaying) {
      // restart playing
    }
  }

  updateDisplay() {
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