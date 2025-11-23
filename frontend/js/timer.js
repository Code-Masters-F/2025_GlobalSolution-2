class PomodoroTimer {
  constructor() {
    this.focusDuration = 25 * 60;
    this.breakDuration = 5 * 60;
    this.timeLeft = this.focusDuration;
    this.isRunning = false;
    this.timerId = null;
    this.mode = 'focus'; // 'focus', 'break'

    // Custom values for spinner
    this.customFocus = 25;
    this.customBreak = 5;

    // DOM Elements (Status Bar)
    this.sbTimeDisplay = document.getElementById('status-time');
    this.sbStatusDisplay = document.getElementById('status-state');
    this.sbPlayBtn = document.getElementById('sb-play');
    this.sbPauseBtn = document.getElementById('sb-pause');
    this.sbResetBtn = document.getElementById('sb-reset');

    // DOM Elements (New Modal)
    this.modalCurrentTime = document.getElementById('modal-current-time');
    this.modalCurrentDate = document.getElementById('modal-current-date');
    this.presetCards = document.querySelectorAll('.preset-card');
    this.customFocusDisplay = document.getElementById('custom-focus-display');
    this.customBreakDisplay = document.getElementById('custom-break-display');
    this.spinnerBtns = document.querySelectorAll('.spinner-btn');
    this.applyBtn = document.querySelector('.btn--apply-timer');

    // Progress Circle (legacy support)
    this.progressCircle = document.querySelector('.timer-modal__progress');
    this.circumference = 2 * Math.PI * 90;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateDisplay();
    this.startClock();

    if ("Notification" in window) {
      Notification.requestPermission();
    }
  }

  startClock() {
    // Update current time display
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');

      if (this.modalCurrentTime) {
        this.modalCurrentTime.textContent = `${hours}:${minutes}`;
      }

      if (this.modalCurrentDate) {
        const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        this.modalCurrentDate.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
      }
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  setupEventListeners() {
    // Status Bar Controls
    this.sbPlayBtn?.addEventListener('click', () => this.start());
    this.sbPauseBtn?.addEventListener('click', () => this.pause());
    this.sbResetBtn?.addEventListener('click', () => this.reset());

    // Preset Cards
    this.presetCards.forEach(card => {
      card.addEventListener('click', () => {
        // Remove active from all
        this.presetCards.forEach(c => c.classList.remove('active'));
        // Add to clicked
        card.classList.add('active');

        // Get values
        const focus = parseInt(card.dataset.focus);
        const breakTime = parseInt(card.dataset.break);

        this.focusDuration = focus;
        this.breakDuration = breakTime;

        // Update custom displays
        this.customFocus = focus / 60;
        this.customBreak = breakTime / 60;
        this.updateCustomDisplays();
      });
    });

    // Spinner Buttons
    this.spinnerBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        const target = btn.dataset.target;

        if (target === 'focus') {
          if (action === 'increase' && this.customFocus < 120) this.customFocus += 5;
          if (action === 'decrease' && this.customFocus > 5) this.customFocus -= 5;
        } else if (target === 'break') {
          if (action === 'increase' && this.customBreak < 30) this.customBreak += 1;
          if (action === 'decrease' && this.customBreak > 1) this.customBreak -= 1;
        }

        this.updateCustomDisplays();

        // Remove active from presets when using custom
        this.presetCards.forEach(c => c.classList.remove('active'));
      });
    });

    // Apply Button
    this.applyBtn?.addEventListener('click', () => {
      this.focusDuration = this.customFocus * 60;
      this.breakDuration = this.customBreak * 60;
      this.reset();

      // Close modal using ModalSystem to properly cleanup
      if (window.ModalSystem) {
        window.ModalSystem.close();
      }
    });
  }

  updateCustomDisplays() {
    if (this.customFocusDisplay) {
      this.customFocusDisplay.textContent = this.customFocus;
    }
    if (this.customBreakDisplay) {
      this.customBreakDisplay.textContent = this.customBreak;
    }
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.updateControlsState();

    this.timerId = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();

      if (this.timeLeft <= 0) {
        this.complete();
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    clearInterval(this.timerId);
    this.updateControlsState();
  }

  reset() {
    this.pause();
    this.timeLeft = this.mode === 'focus' ? this.focusDuration : this.breakDuration;
    this.updateDisplay();
  }

  setMode(mode) {
    this.mode = mode;
    this.reset();
  }

  complete() {
    this.pause();
    this.playNotificationSound();

    // Toggle mode
    if (this.mode === 'focus') {
      this.mode = 'break';
    } else {
      this.mode = 'focus';
    }

    // Show notification
    if (Notification.permission === "granted") {
      new Notification("FocusWave", {
        body: this.mode === 'focus' ? "Hora de focar!" : "Hora de descansar!",
        icon: "/favicon.ico"
      });
    }

    this.reset();
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Update Status Bar
    if (this.sbTimeDisplay) this.sbTimeDisplay.textContent = timeString;
    if (this.sbStatusDisplay) this.sbStatusDisplay.textContent = this.mode === 'focus' ? 'Foco' : 'Pausa';

    // Update Title
    document.title = `${timeString} - FocusWave`;

    // Update Circle Progress (legacy)
    this.updateProgressCircle();
  }

  updateProgressCircle() {
    if (!this.progressCircle) return;

    const totalTime = this.mode === 'focus' ? this.focusDuration : this.breakDuration;
    const progress = this.timeLeft / totalTime;
    const dashoffset = this.circumference * (1 - progress);

    this.progressCircle.style.strokeDashoffset = dashoffset;
  }

  updateControlsState() {
    const isRunning = this.isRunning;

    if (this.sbPlayBtn) {
      this.sbPlayBtn.disabled = isRunning;
      this.sbPlayBtn.style.display = isRunning ? 'none' : 'flex';
    }
    if (this.sbPauseBtn) {
      this.sbPauseBtn.disabled = !isRunning;
      this.sbPauseBtn.style.display = isRunning ? 'flex' : 'none';
    }
  }

  playNotificationSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.1;
      osc.start();
      setTimeout(() => osc.stop(), 200);
    } catch (e) {
      console.error("Audio error", e);
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.timer = new PomodoroTimer();
});
