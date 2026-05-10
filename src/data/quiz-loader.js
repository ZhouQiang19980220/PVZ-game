let _subjects = null;

export async function loadQuiz(plantsBase) {
    const res = await fetch('./quiz.json');
    if (!res.ok) throw new Error(`无法加载题库: ${res.status}`);
    const data = await res.json();
    _subjects = data.subjects;

    plantsBase.forEach(p => {
        if (!_subjects[p.subject]) {
            console.warn(`植物 "${p.id}" 引用了不存在的学科 "${p.subject}"，请检查 quiz.json`);
        }
    });
}

export function getSubjects() {
    return _subjects ? Object.keys(_subjects) : [];
}

export function getQuizPool(subject) {
    return _subjects?.[subject]?.questions ?? [];
}

export function getSubjectName(subject) {
    return _subjects?.[subject]?.name ?? subject;
}
