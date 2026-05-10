import { CFG } from './config.js';

export const state = {
    mode: 'classic',
    energy: 50,
    score: 0,
    wave: 0,
    paused: false,
    over: false,
    plants: [],
    zombies: [],
    projectiles: [],
    energies: [],
    particles: [],
    selectedPlant: null,
    correctCount: 0,
    grid: [],
    plantStats: {}
};

export function initState(mode, plantStats) {
    state.mode = mode;
    state.energy = 50;
    state.score = 0;
    state.wave = 0;
    state.paused = false;
    state.over = false;
    state.plants = [];
    state.zombies = [];
    state.projectiles = [];
    state.energies = [];
    state.particles = [];
    state.selectedPlant = null;
    state.correctCount = 0;
    state.plantStats = plantStats;
    initGrid();
}

// 数值字段
export function addEnergy(n) { state.energy = Math.min(9999, state.energy + n); }
export function spendEnergy(n) { state.energy -= n; }
export function addScore(n) { state.score += n; }
export function setWave(n) { state.wave = n; }
export function incrementWave() { state.wave += 1; }
export function setMode(m) { state.mode = m; }
export function setPaused(b) { state.paused = b; }
export function setOver(b) { state.over = b; }
export function incrementCorrectCount() { state.correctCount += 1; }

// 选中态
export function setSelectedPlant(p) { state.selectedPlant = p; }
export function clearSelectedPlant() { state.selectedPlant = null; }

// 实体集合
export function addPlant(p) { state.plants.push(p); }
export function filterPlants(fn) { state.plants = state.plants.filter(fn); }

export function addZombie(z) { state.zombies.push(z); }
export function filterZombies(fn) { state.zombies = state.zombies.filter(fn); }

export function addProjectile(p) { state.projectiles.push(p); }
export function filterProjectiles(fn) { state.projectiles = state.projectiles.filter(fn); }

export function addParticle(p) { state.particles.push(p); }
export function filterParticles(fn) { state.particles = state.particles.filter(fn); }

export function addEnergyOrb(e) { state.energies.push(e); }
export function filterEnergyOrbs(fn) { state.energies = state.energies.filter(fn); }

// 网格
export function initGrid() {
    state.grid = Array(CFG.ROWS).fill(null).map(() => Array(CFG.COLS).fill(null));
}
export function setGridCell(r, c, v) { state.grid[r][c] = v; }
export function getGridCell(r, c) { return state.grid[r] ? state.grid[r][c] : null; }
export function isCellEmpty(r, c) { return !state.grid[r] || !state.grid[r][c]; }
