export function showStartScreen() {
    document.getElementById('startScreen').classList.remove('hidden');
}
export function hideStartScreen() {
    document.getElementById('startScreen').classList.add('hidden');
}

export function showGameScreen() {
    document.getElementById('gameScreen').classList.remove('hidden');
}
export function hideGameScreen() {
    document.getElementById('gameScreen').classList.add('hidden');
}

export function setModeIndicator(mode) {
    document.getElementById('modeIndicator').textContent = mode === 'classic' ? '经典模式' : '无限模式';
}

export function showWaveAlert(text, duration = 2000) {
    const el = document.getElementById('waveAlert');
    document.getElementById('alertText').textContent = text;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), duration);
}

export function showEndScreen({ win, mode, score, wave }) {
    document.getElementById('endModal').classList.remove('hidden');
    document.getElementById('endTitle').textContent =
        win ? "恭喜通关" : (mode === 'endless' ? "坚持了很久！" : "知识基地沦陷");
    document.getElementById('endMsg').textContent =
        win ? "你成功守住了知识基地！" : "难题僵尸突破了防线...";
    document.getElementById('endScore').textContent = score;
    document.getElementById('endWave').textContent = wave;
}
