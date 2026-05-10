import { CFG } from '../config.js';
import { state } from '../state.js';
import { getCanvas, getCtx } from './canvas.js';

export function render() {
    const canvas = getCanvas();
    const ctx = getCtx();
    const s = CFG.scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(s, s);

    drawLawn(ctx);
    state.plants.forEach(p => drawPlant(ctx, p));
    state.projectiles.forEach(proj => drawProjectile(ctx, proj));
    state.zombies.forEach(z => drawZombie(ctx, z));
    state.energies.forEach(e => drawEnergyOrb(ctx, e));
    state.particles.forEach(p => drawParticle(ctx, p));

    ctx.globalAlpha = 1;
    ctx.restore();
}

function drawLawn(ctx) {
    for (let r = 0; r < CFG.ROWS; r++) {
        for (let c = 0; c < CFG.COLS; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#1a3d24' : '#153020';
            ctx.fillRect(c * CFG.CELL_W, r * CFG.CELL_H, CFG.CELL_W, CFG.CELL_H);
        }
    }
}

function drawPlant(ctx, p) {
    ctx.fillStyle = p.color;

    if (p.type === 'mine') {
        if (p.state === 'armed') {
            ctx.beginPath(); ctx.arc(p.x, p.y, 20, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText("就绪", p.x, p.y + 4);
        } else {
            ctx.globalAlpha = 0.6;
            ctx.beginPath(); ctx.arc(p.x, p.y, 15, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
        }
    } else {
        ctx.beginPath(); ctx.arc(p.x, p.y, 28, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = p.color + '44';
        ctx.beginPath(); ctx.arc(p.x, p.y, 18, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(p.name.slice(0, 2), p.x, p.y + 4);
    }

    const hpRatio = Math.max(0, p.hp / p.maxHp);
    if (hpRatio < 1) {
        ctx.fillStyle = '#333';
        ctx.fillRect(p.x - 20, p.y + 30, 40, 4);
        ctx.fillStyle = hpRatio > 0.5 ? '#22c55e' : '#ef4444';
        ctx.fillRect(p.x - 20, p.y + 30, 40 * hpRatio, 4);
    }
}

function drawProjectile(ctx, proj) {
    ctx.fillStyle = proj.color;
    ctx.beginPath(); ctx.arc(proj.x, proj.y, proj.pierce ? 10 : 6, 0, Math.PI * 2); ctx.fill();
    if (proj.pierce) {
        ctx.fillStyle = 'rgba(255, 100, 0, 0.5)';
        ctx.beginPath(); ctx.arc(proj.x - 5, proj.y, 12, 0, Math.PI * 2); ctx.fill();
    }
}

function drawZombie(ctx, z) {
    ctx.fillStyle = z.slowed ? '#06b6d4' : '#7c3aed';
    ctx.beginPath(); ctx.arc(z.x, z.y, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(z.x - 6, z.y - 5, 4, 0, Math.PI * 2);
    ctx.arc(z.x + 6, z.y - 5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(z.x - 6, z.y - 5, 2, 0, Math.PI * 2);
    ctx.arc(z.x + 6, z.y - 5, 2, 0, Math.PI * 2);
    ctx.fill();

    const hpRatio = Math.max(0, z.hp / z.maxHp);
    ctx.fillStyle = '#333'; ctx.fillRect(z.x - 15, z.y - 30, 30, 4);
    ctx.fillStyle = '#ef4444'; ctx.fillRect(z.x - 15, z.y - 30, 30 * hpRatio, 4);
}

function drawEnergyOrb(ctx, e) {
    ctx.fillStyle = '#facc15';
    ctx.beginPath(); ctx.arc(e.x, e.y, 12, 0, Math.PI * 2); ctx.fill();
}

function drawParticle(ctx, p) {
    ctx.globalAlpha = p.life / 500;
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
}
