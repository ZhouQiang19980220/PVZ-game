import { CFG } from './config.js';
import {
    state,
    initState,
    addEnergy,
    setSelectedPlant,
    clearSelectedPlant,
    addPlant,
    setGridCell,
    isCellEmpty
} from './state.js';
import { PLANTS_BASE } from './data/plants.js';
import { loadQuiz } from './data/quiz-loader.js';
import { createPlant } from './entities/plant.js';

import { initCanvas } from './systems/canvas.js';
import { startLoop } from './systems/loop.js';
import { attachInput } from './systems/input.js';
import { scheduleFirstWave } from './systems/wave.js';
import { initBgm } from './systems/audio.js';

import {
    hideStartScreen,
    showGameScreen,
    setModeIndicator
} from './ui/screens.js';
import { renderCards, updateCards } from './ui/cards.js';
import { updateHud, attachHudButtons } from './ui/hud.js';
import { openQuiz } from './ui/quiz-modal.js';

function buildPlantStats(mode) {
    const stats = {};
    const pScale = CFG.SCALE[mode];
    PLANTS_BASE.forEach(p => {
        const s = { ...p };
        if (mode === 'endless') {
            if (s.dmg) s.dmg *= pScale;
            if (s.hp) s.hp *= 1.2;
        }
        stats[p.id] = s;
    });
    return stats;
}

function autoPopulatePlants(plantStats) {
    const templates = Object.values(plantStats);
    for (let row = 0; row < CFG.ROWS; row++) {
        const col = Math.floor(Math.random() * Math.floor(CFG.COLS / 2));
        const tpl = templates[Math.floor(Math.random() * templates.length)];
        if (isCellEmpty(row, col)) {
            const p = createPlant(tpl, row, col);
            addPlant(p);
            setGridCell(row, col, p);
        }
    }
}

function initGame(mode) {
    const plantStats = buildPlantStats(mode);
    initState(mode, plantStats);

    if (mode === 'test') addEnergy(9999);

    setModeIndicator(mode);
    hideStartScreen();
    showGameScreen();

    initCanvas('gameCanvas');
    attachInput();
    attachHudButtons();

    renderCards(onPick);
    updateHud();

    if (mode === 'test') autoPopulatePlants(plantStats);

    startLoop();

    setInterval(() => {
        if (!state.paused && !state.over) {
            addEnergy(25);
            updateHud();
        }
    }, CFG.ENERGY_RATE);

    scheduleFirstWave();
}

function onPick(plant) {
    if (state.energy < plant.cost) return;
    setSelectedPlant(plant);
    updateCards();
    if (state.mode === 'test') return;
    openQuiz(plant.subject, {
        onCorrect: () => { /* selectedPlant 保持，等画布点击 */ },
        onFail: () => {
            clearSelectedPlant();
            updateCards();
        }
    });
}

async function bootstrap() {
    await loadQuiz(PLANTS_BASE);
    initBgm();

    document.getElementById('btnClassic').addEventListener('click', () => initGame('classic'));
    document.getElementById('btnEndless').addEventListener('click', () => initGame('endless'));
    document.getElementById('btnTest').addEventListener('click', () => initGame('test'));
    document.getElementById('btnRestart').addEventListener('click', () => location.reload());
}

bootstrap();
