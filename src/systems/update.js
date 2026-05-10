import {
    filterPlants,
    filterZombies,
    filterProjectiles,
    filterParticles,
    filterEnergyOrbs
} from '../state.js';
import { tickPlant } from '../entities/plant.js';
import { tickZombie } from '../entities/zombie.js';
import { tickProjectile } from '../entities/projectile.js';
import { tickParticle } from '../entities/particle.js';
import { tickEnergyOrb } from '../entities/energy-orb.js';

export function update(dt) {
    const now = performance.now();

    // 顺序敏感：plant 可能产生 projectile / energy-orb / particle，所以先跑
    filterPlants(p => tickPlant(p, dt, now));
    filterProjectiles(p => tickProjectile(p, dt));
    filterZombies(z => tickZombie(z, dt));
    filterEnergyOrbs(e => tickEnergyOrb(e, dt));
    filterParticles(p => tickParticle(p, dt));
}
