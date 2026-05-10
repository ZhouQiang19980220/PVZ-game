import { CFG } from '../config.js';
import { state, addZombie, setWave, incrementWave } from '../state.js';
import { createZombie } from '../entities/zombie.js';
import { showWaveAlert } from '../ui/screens.js';
import { updateHud } from '../ui/hud.js';
import { endGame } from '../actions.js';

// 纯函数：可单测的难度公式
export function zombieCountForWave(mode, wave) {
    return mode === 'endless' ? (3 + wave) : (2 + wave);
}

export function zombieBaseHpForWave(mode, wave) {
    return mode === 'endless' ? (60 + wave * 10) : (80 + wave * 15);
}

export function scheduleFirstWave() {
    showWaveAlert("准备阶段\n第一波将在15秒后到来");
    setTimeout(() => {
        if (state.over) return;
        setWave(1);
        updateHud();
        spawnWave();
    }, CFG.INITIAL_DELAY);
}

export function spawnWave() {
    if (state.over) return;
    showWaveAlert(`第 ${state.wave} 波来袭！`);

    const isEndless = state.mode === 'endless';
    const count = zombieCountForWave(state.mode, state.wave);

    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            if (state.over) return;
            const row = Math.floor(Math.random() * CFG.ROWS);
            const baseHp = zombieBaseHpForWave(state.mode, state.wave);
            addZombie(createZombie({ row, hp: baseHp }));
        }, i * CFG.SPAWN_INTERVAL);
    }

    if (isEndless || state.wave < 5) {
        setTimeout(() => {
            if (state.over) return;
            if (!isEndless && state.wave === 5) {
                endGame(true);
            } else {
                incrementWave();
                updateHud();
                spawnWave();
            }
        }, CFG.WAVE_INTERVAL);
    }
}
