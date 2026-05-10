import { getQuizPool, getSubjectName } from '../data/quiz-loader.js';
import { setPaused, addScore, incrementCorrectCount } from '../state.js';
import { updateHud } from './hud.js';

let _timer = null;

export function openQuiz(subject, { onCorrect, onFail }) {
    setPaused(true);
    document.getElementById('quizModal').classList.remove('hidden');

    const pool = getQuizPool(subject);
    const q = pool[Math.floor(Math.random() * pool.length)];

    document.getElementById('quizSubject').textContent = getSubjectName(subject);
    document.getElementById('quizQuestion').textContent = q.q;

    const optsBox = document.getElementById('quizOptions');
    optsBox.innerHTML = '';
    q.opts.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.textContent = `${String.fromCharCode(65 + i)}. ${opt}`;
        btn.onclick = () => answer(i, q.ans, onCorrect, onFail);
        optsBox.appendChild(btn);
    });

    let time = 15;
    document.getElementById('quizTimer').textContent = time;
    if (_timer) clearInterval(_timer);
    _timer = setInterval(() => {
        time--;
        document.getElementById('quizTimer').textContent = time;
        if (time <= 0) {
            clearInterval(_timer);
            failQuiz(onFail);
        }
    }, 1000);
}

function answer(selected, correct, onCorrect, onFail) {
    clearInterval(_timer);
    document.querySelectorAll('#quizOptions .opt-btn').forEach((btn, i) => {
        btn.disabled = true;
        if (i === correct) btn.classList.add('correct');
        if (i === selected && selected !== correct) btn.classList.add('wrong');
    });

    if (selected === correct) {
        incrementCorrectCount();
        addScore(10);
        updateHud();
        setTimeout(() => closeQuiz(onCorrect), 500);
    } else {
        setTimeout(() => failQuiz(onFail), 1000);
    }
}

function failQuiz(onFail) {
    clearInterval(_timer);
    setTimeout(() => closeQuiz(onFail), 500);
}

function closeQuiz(callback) {
    document.getElementById('quizModal').classList.add('hidden');
    setPaused(false);
    if (callback) callback();
}
