import { CFG } from '../config.js';
import { state, addProjectile, setGridCell } from '../state.js';
import { spawnEnergyOrb } from './energy-orb.js';
import { spawnParticles } from './particle.js';
import { createProjectile } from './projectile.js';

export function createPlant(template, row, col) {
    const stats = state.plantStats[template.id];
    return {
        ...stats,
        row,
        col,
        x: col * CFG.CELL_W + CFG.CELL_W / 2,
        y: row * CFG.CELL_H + CFG.CELL_H / 2,
        hp: stats.hp,
        maxHp: stats.hp,
        lastShot: 0,
        lastProduce: 0,
        state: 'idle',
        placedTime: performance.now()
    };
}

export function tickPlant(p, dt, now) {
    if (p.type === 'mine') {
        if (p.state === 'idle' && now - p.placedTime > p.prepTime) {
            p.state = 'armed';
        }
        if (p.state === 'armed') {
            const z = state.zombies.find(z => z.row === p.row && Math.abs(z.x - p.x) < 30);
            if (z) {
                state.zombies.forEach(zombie => {
                    if (Math.abs(zombie.x - p.x) < 80 && zombie.row === p.row) {
                        zombie.hp -= p.dmg;
                        spawnParticles(zombie.x, zombie.y, p.color, 15);
                    }
                });
                spawnParticles(p.x, p.y, '#ffffff', 20);
                setGridCell(p.row, p.col, null);
                return false;
            }
        }
    }

    if (p.type === 'producer') {
        p.lastProduce += dt;
        if (p.lastProduce > 5000) {
            p.lastProduce = 0;
            spawnEnergyOrb(p.x, p.y - 20);
        }
    }

    if (p.type === 'shooter') {
        const hasZombie = state.zombies.some(z => z.row === p.row && z.x > p.x && z.x <= CFG.COLS * CFG.CELL_W);
        if (hasZombie) {
            p.lastShot += dt;
            if (p.lastShot > p.rate) {
                p.lastShot = 0;
                addProjectile(createProjectile(p));
            }
        }
    }

    if (p.hp <= 0) {
        setGridCell(p.row, p.col, null);
        return false;
    }
    return true;
}
