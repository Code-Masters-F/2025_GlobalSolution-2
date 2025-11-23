class PlayerController {
  constructor() {
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.tracks = [];
    this.volume = 0.7;

    // Audio Engine
    this.audio = new Audio();
    this.audio.volume = this.volume;

    // DOM Elements
    this.playBtn = document.getElementById('player-play');
    this.prevBtn = document.getElementById('player-prev');
    this.nextBtn = document.getElementById('player-next');
    this.titleDisplay = document.getElementById('player-title');
    this.descDisplay = document.getElementById('player-description');
    this.volumeBar = document.querySelector('.volume-bar');
    this.volumeContainer = document.querySelector('.player-volume');

    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.setupVolumeControl();
    await this.loadPlaylist();
  }

  setupVolumeControl() {
    if (!this.volumeContainer) return;

    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = this.volume * 100;
    volumeSlider.className = 'volume-slider';

    // Set initial gradient
    this.updateVolumeSliderStyle(volumeSlider, this.volume * 100);

    volumeSlider.addEventListener('input', (e) => {
      const value = e.target.value / 100;
      this.setVolume(value);
      this.updateVolumeSliderStyle(volumeSlider, e.target.value);
    });

    if (this.volumeBar) {
      this.volumeBar.replaceWith(volumeSlider);
    } else {
      this.volumeContainer.appendChild(volumeSlider);
    }

    this.volumeSlider = volumeSlider;
  }

  updateVolumeSliderStyle(slider, value) {
    const percentage = value;
    slider.style.background = `linear-gradient(to right, var(--accent-primary, #06b6d4) ${percentage}%, rgba(255,255,255,0.2) ${percentage}%)`;
  }

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
    this.audio.volume = this.volume;
  }

  async loadPlaylist() {
    if (window.MusicService) {
      try {
        const musics = await window.MusicService.getAllMusics();
        if (musics && musics.length > 0) {
          this.tracks = musics;
          this.updateDisplay();
          this.enableControls();
          console.log(`Loaded ${musics.length} tracks`);
        } else {
          console.warn('No musics returned from service');
          if (this.titleDisplay) this.titleDisplay.textContent = "Sem músicas";
        }
      } catch (error) {
        console.error('Failed to load playlist:', error);
        if (this.titleDisplay) this.titleDisplay.textContent = "Erro ao carregar";
      }
    }
  }

  setupEventListeners() {
    this.playBtn?.addEventListener('click', () => this.togglePlay());
    this.prevBtn?.addEventListener('click', () => this.prevTrack());
    this.nextBtn?.addEventListener('click', () => this.nextTrack());

    this.audio.addEventListener('ended', () => this.nextTrack());
    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.updateControls();
    });
    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.updateControls();
    });
    this.audio.addEventListener('error', (e) => {
      console.error('Audio error:', e);
    });
  }

  enableControls() {
    if (this.playBtn) this.playBtn.disabled = false;
    if (this.prevBtn) this.prevBtn.disabled = false;
    if (this.nextBtn) this.nextBtn.disabled = false;
  }

  togglePlay() {
    if (this.tracks.length === 0) {
      console.warn('No tracks to play');
      return;
    }

    if (!this.audio.src) {
      this.playTrack(this.tracks[this.currentTrackIndex]);
    } else if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch(e => console.error('Play error:', e));
    }

    this.updateControls();
  }

  playTrack(track) {
    if (!track || !track.url) {
      console.error('Invalid track:', track);
      return;
    }

    console.log('Playing:', track.title);

    this.audio.src = track.url;
    this.audio.play().catch(e => console.error('Play error:', e));
    this.isPlaying = true;

    this.updateDisplay();
    this.updateControls();
  }

  prevTrack() {
    if (this.tracks.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.playTrack(this.tracks[this.currentTrackIndex]);
  }

  nextTrack() {
    if (this.tracks.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.playTrack(this.tracks[this.currentTrackIndex]);
  }

  updateDisplay() {
    if (this.tracks.length === 0) return;

    const track = this.tracks[this.currentTrackIndex];
    if (this.titleDisplay) this.titleDisplay.textContent = track.title || 'Sem título';
    if (this.descDisplay) this.descDisplay.textContent = track.description || track.category || '';
  }

  updateControls() {
    if (this.playBtn) {
      this.playBtn.classList.toggle('playing', this.isPlaying);
      this.playBtn.innerHTML = this.isPlaying
        ? '<i data-lucide="pause"></i>'
        : '<i data-lucide="play"></i>';
      if (window.lucide) lucide.createIcons();
    }
  }

  stop() {
    this.isPlaying = false;
    this.audio.pause();
    this.audio.currentTime = 0;
    this.updateControls();
  }

  // Called by chat when clicking "Tocar Agora"
  loadTrack(track) {
    if (!track) {
      console.error('loadTrack: no track provided');
      return;
    }

    console.log('loadTrack called with:', track);

    // Add to playlist if not exists
    let index = this.tracks.findIndex(t => t.title === track.title);
    if (index === -1) {
      this.tracks.push(track);
      index = this.tracks.length - 1;
    }

    this.currentTrackIndex = index;
    this.enableControls();

    this.playTrack(track);

    // Add to history
    if (window.HistorySystem) {
      window.HistorySystem.addToHistory(track);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.player = new PlayerController();
});
