import { addEnergyOrb, addEnergy } from '../state.js';

export function spawnEnergyOrb(x, y) {
    addEnergyOrb({ x, y, life: 8000, collected: false });
}

export function tickEnergyOrb(e, dt) {
    e.y -= 0.5;
    e.life -= dt;
    if (e.life < 0 && !e.collected) {
        e.collected = true;
        addEnergy(25);
    }
    return e.life > -500;
}
