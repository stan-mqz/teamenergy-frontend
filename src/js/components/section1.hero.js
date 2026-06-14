/* ═══════════════════════════════════════════════
   SECTION 1: HERO COMPONENT — "Mecánica"
   Generación dinámica del panel izquierdo interactivo
   ═══════════════════════════════════════════════ */

/**
 * Genera partículas de luz mecánicas flotantes en el panel izquierdo
 * @param {HTMLElement} container 
 */
function spawnS1Particles(container) {
    for (let i = 0; i < 22; i++) {
        const p = document.createElement('span');
        p.classList.add('hero-particle'); // Mantiene la clase para heredar las partículas de la app
        const size = Math.random() * 5 + 2;
        p.style.cssText = `
            left:               ${Math.random() * 100}%;
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
 * Crea el panel Hero principal para la sección de Energía Mecánica
 * @param {Object} section - Objeto con los datos de título y descripción del backend
 * @returns {HTMLElement} Contenedor del panel izquierdo estructurado
 */
export function createHero(section) {
    // Creamos el panel izquierdo con su clase base aislada
    const heroPanel = document.createElement('div');
    heroPanel.classList.add('s1-panel-left');

    // Orbes decorativos dinámicos de fondo (Estructura idéntica a S6)
    [1, 2].forEach(n => {
        const orb = document.createElement('div');
        orb.classList.add('s1-hero-orb', `s1-hero-orb-${n}`);
        heroPanel.appendChild(orb);
    });

    // Inyección de partículas de luz controladas
    spawnS1Particles(heroPanel);

    // Contenido interno del juego (Estructura gemela adaptada a Mecánica)
    const innerContainer = document.createElement('div');
    innerContainer.classList.add('s1-hero-inner');
    
    innerContainer.innerHTML = `
        <header class="s1-header">
            <h1 class="s1-main-title">${section.title || 'MECÁNICA'}</h1>
            <h2 class="s1-subtitle">${section.description || '¡Aprende sobre la energía mecánica!'}</h2>
        </header>

        <div class="s1-illustration-area">
            <div class="s1-canvas-container">
                <div class="s1-board">
                    <div class="s1-formula-main">E<sub>m</sub> = E<sub>p</sub> + E<sub>c</sub></div>
                </div>
                <div class="s1-pendulum-render"></div>
            </div>
        </div>

        <button class="s1-btn-start" id="s1-start-trigger">Comenzar</button>
    `;

    heroPanel.appendChild(innerContainer);

    return heroPanel;
}