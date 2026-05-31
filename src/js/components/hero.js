export function createHero(section) {

    const hero =
        document.createElement("section");

    hero.classList.add("hero");

    hero.style.backgroundColor =
        section.background_color;

    hero.style.color =
        section.text_color;

    hero.innerHTML = `
        <div class="hero-content">

            <span class="hero-tag">
                Sección 6
            </span>

            <h1>
                ${section.title}
            </h1>

            <p>
                ${section.description}
            </p>

            <div class="sun-animation">
                ☀️
            </div>

        </div>
    `;

    return hero;
}