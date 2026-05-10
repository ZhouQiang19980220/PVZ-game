import { state, setOver } from './state.js';
import { showEndScreen } from './ui/screens.js';

export function endGame(win) {
    if (state.over) return;
    setOver(true);
    showEndScreen({
        win,
        mode: state.mode,
        score: state.score,
        wave: state.wave
    });
}
