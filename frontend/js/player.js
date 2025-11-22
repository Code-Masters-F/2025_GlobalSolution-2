class PlayerController {
  constructor() {
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.tracks = [];
    this.volume = 0.7;
    this.currentMode = 'none'; // 'none', 'youtube', 'audio'
    this.errorCount = 0;
    this.maxErrors = 2;

    // Audio Engine (para MP3/arquivos de áudio)
    this.audio = new Audio();
    this.audio.volume = this.volume;

    // YouTube Player
    this.ytPlayer = null;
    this.isYouTubeReady = false;
    this.pendingVideoId = null;
    this.currentVideoId = null;

    // DOM Elements
    this.playBtn = document.getElementById('player-play');
    this.prevBtn = document.getElementById('player-prev');
    this.nextBtn = document.getElementById('player-next');
    this.titleDisplay = document.getElementById('player-title');
    this.descDisplay = document.getElementById('player-description');
    this.volumeBar = document.querySelector('.volume-bar');
    this.volumeContainer = document.querySelector('.player-volume');

    // Video area elements
    this.videoArea = document.getElementById('player-video-area');
    this.videoPlaceholder = document.getElementById('video-placeholder');
    this.ytEmbedContainer = document.getElementById('yt-embed-container');
    this.videoFallback = document.getElementById('video-fallback');
    this.videoThumbnail = document.getElementById('video-thumbnail');
    this.ytExternalLink = document.getElementById('yt-external-link');

    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.setupVolumeControl();
    this.loadYouTubeAPI();
    await this.loadPlaylist();
  }

  loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      this.initYouTubePlayer();
      return;
    }

    if (!document.getElementById('youtube-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-api-script';
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      this.initYouTubePlayer();
    };
  }

  initYouTubePlayer() {
    if (!this.ytEmbedContainer) return;

    this.ytPlayer = new YT.Player('yt-embed-container', {
      height: '100%',
      width: '100%',
      playerVars: {
        'autoplay': 1,
        'controls': 1,
        'modestbranding': 1,
        'rel': 0,
        'playsinline': 1,
        'origin': window.location.origin
      },
      events: {
        'onReady': () => {
          this.isYouTubeReady = true;
          this.ytPlayer.setVolume(this.volume * 100);
          console.log('YouTube Player ready');

          if (this.pendingVideoId) {
            this.playYouTubeVideo(this.pendingVideoId);
            this.pendingVideoId = null;
          }
        },
        'onStateChange': (event) => this.onYouTubeStateChange(event),
        'onError': (event) => this.onYouTubeError(event)
      }
    });
  }

  onYouTubeStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      this.nextTrack();
    } else if (event.data === YT.PlayerState.PLAYING) {
      this.isPlaying = true;
      this.errorCount = 0;
      this.updateControls();
    } else if (event.data === YT.PlayerState.PAUSED) {
      this.isPlaying = false;
      this.updateControls();
    }
  }

  onYouTubeError(event) {
    console.error('YouTube error code:', event.data);
    this.errorCount++;

    // Error codes: 2 (invalid param), 5 (HTML5 error), 100 (not found), 101/150 (embed disabled)
    if (event.data === 101 || event.data === 150 || event.data === 100) {
      // Video can't be embedded - show fallback
      this.showFallback();
    } else if (this.errorCount < this.maxErrors) {
      setTimeout(() => this.nextTrack(), 1500);
    } else {
      console.error('Too many errors, showing fallback');
      this.showFallback();
    }
  }

  showVideoArea(mode) {
    // mode: 'placeholder', 'youtube', 'fallback'
    if (this.videoPlaceholder) this.videoPlaceholder.style.display = mode === 'placeholder' ? 'flex' : 'none';
    if (this.ytEmbedContainer) this.ytEmbedContainer.style.display = mode === 'youtube' ? 'block' : 'none';
    if (this.videoFallback) this.videoFallback.style.display = mode === 'fallback' ? 'flex' : 'none';
  }

  showFallback() {
    const track = this.tracks[this.currentTrackIndex];
    if (!track || !track.url) return;

    const videoId = this.extractVideoID(track.url);
    if (videoId) {
      // Set thumbnail (using medium quality - 320x180)
      if (this.videoThumbnail) {
        this.videoThumbnail.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }
      // Set external link
      if (this.ytExternalLink) {
        this.ytExternalLink.href = track.url;
      }
    }

    this.showVideoArea('fallback');
    this.isPlaying = false;
    this.updateControls();

    // Pause YouTube if playing
    if (this.ytPlayer && this.isYouTubeReady) {
      try { this.ytPlayer.pauseVideo(); } catch (e) { }
    }

    if (window.lucide) lucide.createIcons();
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

    if (this.ytPlayer && this.isYouTubeReady) {
      try { this.ytPlayer.setVolume(this.volume * 100); } catch (e) { }
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

    if (this.currentMode === 'none') {
      this.isPlaying = true;
      this.playTrack(this.tracks[this.currentTrackIndex]);
    } else if (this.currentMode === 'youtube') {
      if (this.ytPlayer && this.isYouTubeReady) {
        if (this.isPlaying) {
          this.ytPlayer.pauseVideo();
        } else {
          this.ytPlayer.playVideo();
        }
      }
    } else if (this.currentMode === 'audio') {
      if (this.isPlaying) {
        this.audio.pause();
      } else {
        this.audio.play().catch(e => console.error('Play error:', e));
      }
    }

    this.updateControls();
  }

  playTrack(track) {
    if (!track || !track.url) {
      console.error('Invalid track:', track);
      return;
    }

    // Stop previous playback
    this.audio.pause();
    this.audio.currentTime = 0;

    const url = track.url;
    console.log('Playing:', track.title);

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      this.currentMode = 'youtube';
      const videoId = this.extractVideoID(url);

      if (videoId) {
        this.currentVideoId = videoId;
        this.playYouTubeVideo(videoId);
      } else {
        console.error('Could not extract video ID from:', url);
        this.showFallback();
      }
    } else {
      this.currentMode = 'audio';
      this.showVideoArea('placeholder');
      this.audio.src = url;
      this.audio.play().catch(e => console.error('Play error:', e));
    }

    this.updateDisplay();
  }

  playYouTubeVideo(videoId) {
    if (this.ytPlayer && this.isYouTubeReady) {
      this.showVideoArea('youtube');
      this.ytPlayer.loadVideoById(videoId);
    } else {
      this.pendingVideoId = videoId;
      this.showVideoArea('youtube');
    }
  }

  extractVideoID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  prevTrack() {
    if (this.tracks.length === 0) return;
    this.errorCount = 0;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.isPlaying = true;
    this.playTrack(this.tracks[this.currentTrackIndex]);
    this.updateControls();
  }

  nextTrack() {
    if (this.tracks.length === 0) return;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.isPlaying = true;
    this.playTrack(this.tracks[this.currentTrackIndex]);
    this.updateControls();
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
    this.errorCount = 0;
    this.enableControls();

    this.isPlaying = true;
    this.playTrack(track);
    this.updateControls();

    // Add to history
    if (window.HistorySystem) {
      window.HistorySystem.addToHistory(track);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.player = new PlayerController();
});
