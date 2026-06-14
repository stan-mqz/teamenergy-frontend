/**
 * Configuración visual por tipo de animación - AGUA
 */
const CONFIGS = {
    water: {
        accent: 'El Agua',
        icon: '💧',
        tags: ['💧 Líquido', '🌊 Océanos', '🏞️ Ríos'],
        fact: '¡El agua es el recurso más importante para la vida en la Tierra!',
        factIcon: '🌍',
        buildVisual(card) {
            card.innerHTML = `
        <div class="anim-water-wrap">
          <div class="anim-water-drop">💧</div>
          <div class="anim-water-ripple"></div>
          <div class="anim-water-ripple"></div>
          <div class="anim-water-ripple"></div>
        </div>
      `;
        },
    },

    rain: {
        accent: 'La Lluvia',
        icon: '🌧️',
        tags: ['☁️ Nubes', '💧 Gotas', '♻️ Ciclo'],
        fact: '¡La lluvia cae en forma de gotas de agua que vienen de las nubes!',
        factIcon: '☁️',
        buildVisual(card) {
            const drops = Array.from({ length: 8 }).map((_, i) => `
        <div class="anim-rain-drop" 
             style="
               left:${Math.random() * 80 + 10}%;
               animation-delay:${i * 0.15}s;
             "></div>
      `).join('');
            card.innerHTML = `
        <div class="anim-rain-wrap">
          <div class="anim-rain-cloud">☁️</div>
          ${drops}
        </div>
      `;
        },
    },

    ice: {
        accent: 'El Hielo',
        icon: '🧊',
        tags: ['❄️ Congelado', '⛸️ Patinaje', '🏔️ Montañas'],
        fact: '¡Cuando el agua se congela se convierte en hielo y flota en el agua!',
        factIcon: '❄️',
        buildVisual(card) {
            card.innerHTML = `
        <div class="anim-ice-wrap">
          <div class="anim-ice-snowflake">❄️</div>
          <div class="anim-ice-block">🧊</div>
          <div class="anim-ice-puddle"></div>
        </div>
      `;
        },
    },

    wave: {
        accent: 'Las Olas',
        icon: '🌊',
        tags: ['🌊 Movimiento', '🏄 Mar', '⛵ Barcos'],
        fact: '¡Las olas son ondas de energía que viajan en el agua del mar!',
        factIcon: '〰️',
        buildVisual(card) {
            card.innerHTML = `
        <div class="anim-waves-wrap">
          <div class="anim-wave-line"></div>
          <div class="anim-wave-line"></div>
          <div class="anim-wave-line"></div>
          <div class="anim-boat">⛵</div>
        </div>
      `;
        },
    },

    ocean: {
        accent: 'Los Océanos',
        icon: '🐠',
        tags: ['🌊 Profundo', '🐠 Peces', '🐙 Animales'],
        fact: '¡Los océanos cubren más del 70% de nuestro planeta y albergan millones de especies!',
        factIcon: '🐚',
        buildVisual(card) {
            card.innerHTML = `
        <div class="anim-ocean-wrap">
          <div class="anim-ocean-surface"></div>
          <div class="anim-fish fish1">🐠</div>
          <div class="anim-fish fish2">🐟</div>
          <div class="anim-coral">🪸</div>
        </div>
      `;
        },
    },

    drinking: {
        accent: 'Agua para Beber',
        icon: '🥤',
        tags: ['💧 Potable', '🚰 Grifo', '🥛 Vaso'],
        fact: '¡Debes beber mucha agua limpia cada día para mantener tu cuerpo sano!',
        factIcon: '💪',
        buildVisual(card) {
            card.innerHTML = `
        <div class="anim-drink-wrap">
          <div class="anim-glass">
            <div class="anim-water-level"></div>
          </div>
          <div class="anim-droplet">💧</div>
        </div>
      `;
        },
    },
};

/** Contador global para numeración */
let sectionCounter = 0;

/**
 * Registra el observer de scroll para animaciones de entrada
 * @param {HTMLElement} el
 * @param {HTMLElement} card
 */
function observe(el, card) {
    const io = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                el.classList.add('in-view');
                setTimeout(() => card.classList.add('pop-in'), 300);
                io.disconnect();
            }
        },
        { threshold: 0.15 }
    );
    io.observe(el);
}

/**
 * @param {Object} section   Dato de la API
 * @returns {HTMLElement}
 */
export function createSection(section) {
    sectionCounter++;
    const cfg = CONFIGS[section.animation] ?? CONFIGS.water;

    const el = document.createElement('section');
    el.classList.add('planet-section');
    el.dataset.anim = section.animation;

    // ── Texto
    const tagsHtml = cfg.tags.map(t =>
        `<span class="planet-tag">${t}</span>`
    ).join('');

    const text = document.createElement('div');
    text.classList.add('planet-text');
    text.innerHTML = `
    <p class="planet-number">0${sectionCounter} / ${cfg.accent}</p>
    <h2 class="planet-title">${section.title}</h2>
    <p class="planet-body">${section.description}</p>
    <div class="planet-tags">${tagsHtml}</div>
    <div class="fun-fact">
      <span class="fun-fact-icon">${cfg.factIcon}</span>
      <span>${cfg.fact}</span>
    </div>
  `;

    // ── Visual animado
    const visual = document.createElement('div');
    visual.classList.add('planet-visual');

    const card = document.createElement('div');
    card.classList.add('visual-card');
    cfg.buildVisual(card);
    visual.appendChild(card);

    el.appendChild(text);
    el.appendChild(visual);

    observe(el, card);
    return el;
}