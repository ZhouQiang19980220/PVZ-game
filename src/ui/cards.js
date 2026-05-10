import { PLANTS_BASE } from '../data/plants.js';
import { state } from '../state.js';

export function renderCards(onPick) {
    const bar = document.getElementById('cardBar');
    bar.innerHTML = '';
    PLANTS_BASE.forEach(p => {
        const card = document.createElement('div');
        card.className = 'plant-card';
        card.dataset.id = p.id;
        card.innerHTML = `
            <div class="text-center">
                <div class="w-10 h-10 mx-auto mb-1 rounded-lg flex items-center justify-center" style="background:${p.color}22; border: 2px solid ${p.color}">
                    <span style="color:${p.color}; font-weight:900; font-size:12px">${p.name.slice(0,2)}</span>
                </div>
                <div class="text-xs font-bold leading-tight">${p.name}</div>
            </div>
            <div class="cost">${p.cost}</div>`;
        card.onclick = () => onPick(p);
        bar.appendChild(card);
    });
    updateCards();
}

export function updateCards() {
    document.querySelectorAll('.plant-card').forEach(card => {
        const plant = PLANTS_BASE.find(p => p.id === card.dataset.id);
        card.classList.toggle('disabled', state.energy < plant.cost);
        card.classList.toggle('selected', state.selectedPlant && state.selectedPlant.id === plant.id);
    });
}
