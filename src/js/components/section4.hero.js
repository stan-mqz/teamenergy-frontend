/**
 * Genera partículas de agua flotantes
 * @param {HTMLElement} container
 */
function spawnParticles(container) {
    for (let i = 0; i < 22; i++) {
        const p = document.createElement('span');
        p.classList.add('hero-particle');
        const size = Math.random() * 5 + 2;
        p.style.cssText = `
      left:                ${Math.random() * 100}%;
      bottom:              -${size * 2}px;
      width:               ${size}px;
      height:              ${size}px;
      animation-duration:  ${Math.random() * 8 + 7}s;
      animation-delay:     ${Math.random() * 10}s;
    `;
        container.appendChild(p);
    }
}

/**
 * Crea el hero principal del Agua
 * @param {Object} section
 * @returns {HTMLElement}
 */
export function createHero(section) {
    const hero = document.createElement('section');
    hero.classList.add('hero');

    // Orbes decorativos
    [1, 2, 3].forEach(n => {
        const orb = document.createElement('div');
        orb.classList.add('hero-orb', `hero-orb-${n}`);
        hero.appendChild(orb);
    });

    // Partículas
    spawnParticles(hero);

    // Contenido
    const inner = document.createElement('div');
    inner.classList.add('hero-inner');
    inner.innerHTML = `
    <span class="hero-badge">✦ Ciencias · 2do Grado ✦</span>
    <div class="hero-sun" role="img" aria-label="Agua">💧</div>
    <h1 class="hero-title">${section.title}</h1>
    <p class="hero-subtitle">${section.description}</p>
  `;
    hero.appendChild(inner);

    // Scroll hint
    const hint = document.createElement('div');
    hint.classList.add('hero-scroll-hint');
    hint.innerHTML = `<span>↓</span>explorar`;
    hero.appendChild(hint);

    return hero;
}