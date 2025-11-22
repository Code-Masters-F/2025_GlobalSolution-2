class PlayerController {
  constructor() {
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.tracks = [];

    // Audio Engines
    this.audio = new Audio();
    this.ytPlayer = null;
    this.isYouTubeReady = false;
    this.currentMode = 'none'; // 'audio' or 'youtube'

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
    this.loadYouTubeAPI();
    await this.loadPlaylist();
  }

  loadYouTubeAPI() {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      // Create hidden container for YT player
      const ytContainer = document.createElement('div');
      ytContainer.id = 'yt-player-container';
      ytContainer.style.position = 'absolute';
      ytContainer.style.top = '-9999px';
      ytContainer.style.left = '-9999px';
      document.body.appendChild(ytContainer);

      window.onYouTubeIframeAPIReady = () => {
        this.ytPlayer = new YT.Player('yt-player-container', {
          height: '0',
          width: '0',
          events: {
            'onReady': () => { this.isYouTubeReady = true; },
            'onStateChange': (event) => this.onPlayerStateChange(event)
          }
        });
      };
    }
  }

  onPlayerStateChange(event) {
    // Sync YT state with UI
    if (event.data === YT.PlayerState.ENDED) {
      this.nextTrack();
    }
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

    // Standard Audio Events
    this.audio.addEventListener('ended', () => this.nextTrack());
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

    // Playback Logic
    if (this.currentMode === 'youtube' && this.ytPlayer && this.isYouTubeReady) {
      if (this.isPlaying) this.ytPlayer.playVideo();
      else this.ytPlayer.pauseVideo();
    } else if (this.currentMode === 'audio') {
      if (this.isPlaying) this.audio.play();
      else this.audio.pause();
    } else {
      // First play or track change needed
      this.playTrack(this.tracks[this.currentTrackIndex]);
    }

    // Update icon
    if (this.playBtn) {
      this.playBtn.innerHTML = this.isPlaying
        ? '<i data-lucide="pause"></i>'
        : '<i data-lucide="play"></i>';

      if (window.lucide) lucide.createIcons();
    }
  }

  playTrack(track) {
    // Stop previous
    this.audio.pause();
    if (this.ytPlayer && this.isYouTubeReady) this.ytPlayer.stopVideo();

    const url = track.url;

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      this.currentMode = 'youtube';
      const videoId = this.extractVideoID(url);
      if (this.ytPlayer && this.isYouTubeReady && videoId) {
        this.ytPlayer.loadVideoById(videoId);
        if (this.isPlaying) this.ytPlayer.playVideo();
      }
    } else {
      this.currentMode = 'audio';
      this.audio.src = url;
      if (this.isPlaying) this.audio.play();
    }
  }

  extractVideoID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  prevTrack() {
    if (this.tracks.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.updateDisplay();
    this.playTrack(this.tracks[this.currentTrackIndex]);
    this.isPlaying = true;
    this.updateControls();
  }

  nextTrack() {
    if (this.tracks.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.updateDisplay();
    this.playTrack(this.tracks[this.currentTrackIndex]);
    this.isPlaying = true;
    this.updateControls();
  }

  updateDisplay() {
    if (this.tracks.length === 0) return;

    const track = this.tracks[this.currentTrackIndex];
    if (this.titleDisplay) this.titleDisplay.textContent = track.title;
    if (this.descDisplay) this.descDisplay.textContent = track.description;
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

  loadTrack(track) {
    let index = this.tracks.findIndex(t => t.title === track.title);

    if (index === -1) {
      this.tracks.push(track);
      index = this.tracks.length - 1;
    }

    this.currentTrackIndex = index;
    this.updateDisplay();
    this.enableControls();

    this.isPlaying = true;
    this.updateControls();
    this.playTrack(track);

    if (window.HistorySystem) {
      window.HistorySystem.addToHistory(track);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.player = new PlayerController();
});