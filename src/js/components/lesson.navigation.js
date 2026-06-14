const LESSONS = [
    { number: 1, title: "Energía Mecánica" },
    { number: 2, title: "Energía Eléctrica" },
    { number: 3, title: "Energía Térmica" },
    { number: 4, title: "Estados de la Materia" },
    { number: 5, title: "Transformaciones" },
    { number: 6, title: "La Luz" },
].map(lesson => ({
    ...lesson,
    href: `/section${lesson.number}.html`
}));

function createButton(kind, lesson) {
    const isPrevious = kind === "previous";
    const label = isPrevious ? "Lección anterior" : "Siguiente lección";
    const direction = isPrevious ? "←" : "→";

    const link = document.createElement("a");
    link.className = "lesson-nav-btn";
    link.href = lesson.href;

    link.innerHTML = `
        <span class="lesson-nav-kicker">${label}</span>
        <span class="lesson-nav-main">
            ${isPrevious ? `${direction} Sección ${lesson.number}` : `Sección ${lesson.number} ${direction}`}
        </span>
        <span class="lesson-nav-title">${lesson.title}</span>
    `;

    return link;
}

export function createLessonNavigation(currentLesson) {
    const nav = document.createElement("nav");
    nav.className = "lesson-nav";
    nav.setAttribute("aria-label", "Navegación entre lecciones");

    const currentIndex = LESSONS.findIndex(
        lesson => lesson.number === currentLesson
    );

    if (currentIndex === -1) {
        console.error(`La lección ${currentLesson} no existe.`);
        return nav;
    }

    const previous = LESSONS[currentIndex - 1];
    const next = LESSONS[currentIndex + 1];

    if (previous) {
        nav.appendChild(createButton("previous", previous));
    }   

    if (next) {
        nav.appendChild(createButton("next", next));
    }

    return nav;
}