import { state } from '../state.js';
import { update } from './update.js';
import { render } from './render.js';
import { updateHud } from '../ui/hud.js';

let lastTime = 0;
let started = false;

export function startLoop() {
    if (started) return;
    started = true;
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

function gameLoop(time) {
    const dt = time - lastTime;
    lastTime = time;
    if (!state.paused && !state.over) {
        update(dt);
        updateHud();
    }
    render();
    requestAnimationFrame(gameLoop);
}
