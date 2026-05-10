import { CFG } from '../config.js';

let canvas = null;
let ctx = null;

export function initCanvas(elementId = 'gameCanvas') {
    canvas = document.getElementById(elementId);
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return canvas;
}

export function getCanvas() { return canvas; }
export function getCtx() { return ctx; }

function resizeCanvas() {
    const container = canvas.parentElement;
    const maxW = container.clientWidth - 20;
    const maxH = container.clientHeight - 20;
    const idealW = CFG.COLS * CFG.CELL_W;
    const idealH = CFG.ROWS * CFG.CELL_H;
    const scale = Math.min(maxW / idealW, maxH / idealH, 1);
    canvas.width = idealW * scale;
    canvas.height = idealH * scale;
    CFG.scale = scale;
}
