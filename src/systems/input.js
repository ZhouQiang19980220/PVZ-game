import { CFG } from '../config.js';
import {
    state,
    spendEnergy,
    addPlant,
    setGridCell,
    isCellEmpty,
    clearSelectedPlant,
    setShoveling,
    removePlant
} from '../state.js';
import { getCanvas } from './canvas.js';
import { createPlant } from '../entities/plant.js';
import { playPlantSfx } from './audio.js';
import { updateCards } from '../ui/cards.js';
import { updateHud } from '../ui/hud.js';

export function attachInput() {
    const canvas = getCanvas();
    canvas.addEventListener('click', handleCanvasClick);
}

function handleCanvasClick(e) {
    if (state.paused || state.over) return;

    const canvas = getCanvas();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / (CFG.CELL_W * CFG.scale));
    const row = Math.floor(y / (CFG.CELL_H * CFG.scale));

    if (col < 0 || col >= CFG.COLS || row < 0 || row >= CFG.ROWS) return;

    if (state.shoveling) {
        const plant = state.grid[row][col];
        if (plant) {
            removePlant(plant);
            setShoveling(false);
            document.getElementById('shovelBtn').classList.remove('active-tool');
            updateHud();
        }
        return;
    }

    if (!state.selectedPlant) return;
    if (!isCellEmpty(row, col)) return;

    const template = state.selectedPlant;
    if (state.energy < template.cost) return;

    spendEnergy(template.cost);
    const newPlant = createPlant(template, row, col);
    addPlant(newPlant);
    setGridCell(row, col, newPlant);
    playPlantSfx();
    clearSelectedPlant();
    updateCards();
    updateHud();
}
