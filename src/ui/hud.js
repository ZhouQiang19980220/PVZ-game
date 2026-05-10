import { state, setPaused } from '../state.js';
import { updateCards } from './cards.js';
import { openQuizBrowser, attachQuizBrowser } from './quiz-browser.js';

export function updateHud() {
    document.getElementById('energyNum').textContent = state.energy;
    document.getElementById('waveNum').textContent =
        state.wave === 0 ? '准备中' : (state.mode === 'endless' ? state.wave : `${state.wave}/5`);
    document.getElementById('scoreNum').textContent = state.score;
    updateCards();
}

export function togglePause() {
    setPaused(!state.paused);
    document.getElementById('pauseBtn').textContent = state.paused ? '继续' : '暂停';
}

export function attachHudButtons() {
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    if (state.mode === 'test') {
        const btn = document.getElementById('quizBrowserBtn');
        btn.classList.remove('hidden');
        btn.addEventListener('click', openQuizBrowser);
        attachQuizBrowser();
    }
}
