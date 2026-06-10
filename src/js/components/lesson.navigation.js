const LESSONS = [
    { number: 1, title: "Energía Mecánica" },
    { number: 2, title: "Energía Eléctrica" },
    { number: 3, title: "Energía Térmica" },
    { number: 4, title: "Estados de la Materia" },
    { number: 5, title: "Transformaciones" },
    { number: 6, title: "La Luz", href: "/section6.html" },
];

function createButton(kind, lesson) {
    const label = kind === "previous" ? "Lección anterior" : "Siguiente lección";
    const direction = kind === "previous" ? "←" : "→";

    if (!lesson?.href) {
        const button = document.createElement("button");
        button.className = "lesson-nav-btn is-disabled";
        button.type = "button";
        button.disabled = true;
        button.innerHTML = `
            <span class="lesson-nav-kicker">${label}</span>
            <span class="lesson-nav-main">${direction} ${lesson ? `Sección ${lesson.number}` : "Próximamente"}</span>
            <span class="lesson-nav-title">${lesson?.title ?? "Sin ruta por ahora"}</span>
        `;
        return button;
    }

    const link = document.createElement("a");
    link.className = "lesson-nav-btn";
    link.href = lesson.href;
    link.innerHTML = `
        <span class="lesson-nav-kicker">${label}</span>
        <span class="lesson-nav-main">${direction} Sección ${lesson.number}</span>
        <span class="lesson-nav-title">${lesson.title}</span>
    `;
    return link;
}

export function createLessonNavigation(currentLesson = 6) {
    const nav = document.createElement("nav");
    nav.className = "lesson-nav";
    nav.setAttribute("aria-label", "Navegación entre lecciones");

    const currentIndex = LESSONS.findIndex(lesson => lesson.number === currentLesson);
    const previous = LESSONS[currentIndex - 1];
    const next = LESSONS[currentIndex + 1];

    nav.appendChild(createButton("previous", previous));
    nav.appendChild(createButton("next", next));

    return nav;
}
