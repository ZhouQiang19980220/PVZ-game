// ============ SFX (Web Audio API 合成) ============
let _sfxCtx = null;

function getSfxCtx() {
    if (!_sfxCtx) _sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (_sfxCtx.state === 'suspended') _sfxCtx.resume();
    return _sfxCtx;
}

// 种植物：三角波上升扫频 200→900 Hz + 高频 ping
export function playPlantSfx() {
    const ctx = getSfxCtx();
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.18);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.32);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.value = 1400;
    gain2.gain.setValueAtTime(0.18, t + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    osc2.connect(gain2); gain2.connect(ctx.destination);
    osc2.start(t + 0.16); osc2.stop(t + 0.35);
}

// 僵尸受击：noise burst + 低频下降，限速 120ms
let _lastHitSfx = 0;
export function playZombieHitSfx() {
    const now = performance.now();
    if (now - _lastHitSfx < 120) return;
    _lastHitSfx = now;

    const ctx = getSfxCtx();
    const t = ctx.currentTime;

    const bufLen = Math.ceil(ctx.sampleRate * 0.07);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 2);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'bandpass'; filt.frequency.value = 700; filt.Q.value = 2;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.28, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    src.connect(filt); filt.connect(noiseGain); noiseGain.connect(ctx.destination);
    src.start(t); src.stop(t + 0.1);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.07);
    oscGain.gain.setValueAtTime(0.22, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(oscGain); oscGain.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.1);
}

// ============ BGM (HTMLAudioElement) ============
let _music = null;
let _musicBtn = null;
let _bgmEnabled = true;

export function initBgm() {
    _music = document.getElementById('bgMusic');
    _musicBtn = document.getElementById('musicBtn');
    const slider = document.getElementById('volSlider');

    _music.volume = slider.value / 100;

    // 浏览器 Autoplay Policy: 等首次用户交互
    function tryPlay() {
        if (_bgmEnabled && _music.paused) {
            _music.play().catch(() => {});
        }
        document.removeEventListener('click', tryPlay);
        document.removeEventListener('keydown', tryPlay);
    }
    document.addEventListener('click', tryPlay);
    document.addEventListener('keydown', tryPlay);
}

export function toggleBgm() {
    _bgmEnabled = !_bgmEnabled;
    if (_bgmEnabled) {
        _music.play().catch(() => {});
        _musicBtn.textContent = '🎵';
        _musicBtn.classList.remove('muted');
    } else {
        _music.pause();
        _musicBtn.textContent = '🔇';
        _musicBtn.classList.add('muted');
    }
}

export function setBgmVolume(val) {
    _music.volume = val / 100;
    if (val == 0) {
        _musicBtn.textContent = '🔇';
        _musicBtn.classList.add('muted');
        _bgmEnabled = false;
    } else if (!_bgmEnabled) {
        _bgmEnabled = true;
        _musicBtn.textContent = '🎵';
        _musicBtn.classList.remove('muted');
        _music.play().catch(() => {});
    } else {
        _musicBtn.textContent = '🎵';
        _musicBtn.classList.remove('muted');
    }
}
