import { CFG } from '../config.js';
import { state } from '../state.js';
import { spawnParticles } from './particle.js';
import { playZombieHitSfx } from '../systems/audio.js';

export function createProjectile(plant) {
    return {
        x: plant.x + 30,
        y: plant.y,
        vx: 6,
        row: plant.row,
        dmg: plant.dmg,
        slow: plant.slow,
        color: plant.color,
        pierce: plant.pierce || false,
        hitIds: new Set()
    };
}

export function tickProjectile(proj, dt) {
    proj.x += proj.vx * (dt / 16);

    for (const z of state.zombies) {
        if (z.row === proj.row && Math.abs(z.x - proj.x) < 25) {
            if (!proj.pierce) {
                z.hp -= proj.dmg;
                if (proj.slow) { z.slowed = true; z.slowTimer = 3000; }
                spawnParticles(z.x, z.y, proj.color);
                playZombieHitSfx();
                return false;
            } else if (!proj.hitIds.has(z.id)) {
                z.hp -= proj.dmg;
                if (proj.slow) { z.slowed = true; z.slowTimer = 3000; }
                spawnParticles(z.x, z.y, proj.color);
                playZombieHitSfx();
                proj.hitIds.add(z.id);
            }
        }
    }
    return proj.x < CFG.COLS * CFG.CELL_W + 50;
}
