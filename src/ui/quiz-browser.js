import { getSubjects, getQuizPool, getSubjectName } from '../data/quiz-loader.js';
import { setPaused } from '../state.js';

export function openQuizBrowser() {
    setPaused(true);
    document.getElementById('quizBrowserModal').classList.remove('hidden');
    renderTabs(getSubjects()[0]);
}

function closeQuizBrowser() {
    document.getElementById('quizBrowserModal').classList.add('hidden');
    setPaused(false);
}

function renderTabs(activeSubject) {
    const tabsEl = document.getElementById('quizBrowserTabs');
    tabsEl.innerHTML = '';
    getSubjects().forEach(subject => {
        const btn = document.createElement('button');
        btn.textContent = getSubjectName(subject);
        btn.className = [
            'px-3 py-1 rounded-full text-xs font-bold border transition-colors',
            subject === activeSubject
                ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]'
        ].join(' ');
        btn.onclick = () => renderTabs(subject);
        tabsEl.appendChild(btn);
    });
    renderQuestions(activeSubject);
}

function renderQuestions(subject) {
    const listEl = document.getElementById('quizBrowserList');
    listEl.innerHTML = '';
    getQuizPool(subject).forEach((q, qi) => {
        const item = document.createElement('div');
        item.className = 'mb-3 p-3 rounded-lg border border-[var(--border)]';
        item.style.background = 'var(--bg)';
        item.innerHTML = `<p class="text-sm font-bold mb-2">Q${qi + 1}. ${q.q}</p>`;
        q.opts.forEach((opt, i) => {
            const row = document.createElement('div');
            const isCorrect = i === q.ans;
            row.className = 'text-xs px-2 py-1 rounded mb-1';
            row.style.cssText = isCorrect
                ? 'background:rgba(74,222,128,0.15); color:#4ade80; font-weight:bold'
                : 'color:var(--muted)';
            row.textContent = `${String.fromCharCode(65 + i)}. ${opt}${isCorrect ? '  ✓' : ''}`;
            item.appendChild(row);
        });
        listEl.appendChild(item);
    });
}

export function attachQuizBrowser() {
    document.getElementById('quizBrowserClose').addEventListener('click', closeQuizBrowser);
}
