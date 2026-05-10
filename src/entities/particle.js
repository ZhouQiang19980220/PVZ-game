import { addParticle } from '../state.js';

export function spawnParticles(x, y, color, count = 5) {
    for (let i = 0; i < count; i++) {
        addParticle({
            x, y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            color,
            life: 500
        });
    }
}

export function tickParticle(p, dt) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2;
    p.life -= dt;
    return p.life > 0;
}
