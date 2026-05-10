import { CFG } from '../config.js';
import { state, getGridCell, addScore } from '../state.js';
import { spawnParticles } from './particle.js';
import { endGame } from '../actions.js';

export function createZombie({ row, hp }) {
    return {
        id: Math.random(),
        x: CFG.COLS * CFG.CELL_W + 50 + Math.random() * 100,
        y: row * CFG.CELL_H + CFG.CELL_H / 2,
        row,
        hp,
        maxHp: hp,
        slowed: false,
        slowTimer: 0
    };
}

export function tickZombie(z, dt) {
    if (z.hp <= 0) {
        addScore(20);
        spawnParticles(z.x, z.y, '#ef4444', 10);
        return false;
    }

    let speed = CFG.ZOMBIE_SPEED;
    if (z.slowed) {
        z.slowTimer -= dt;
        speed *= 0.4;
        if (z.slowTimer <= 0) z.slowed = false;
    }

    const plant = getGridCell(z.row, Math.floor(z.x / CFG.CELL_W));
    if (plant && plant.type !== 'mine' && Math.abs(z.x - plant.x) < 30) {
        plant.hp -= 0.5 * (dt / 16);
    } else {
        z.x -= speed * (dt / 16);
    }

    if (z.x < 30) endGame(false);
    return true;
}
