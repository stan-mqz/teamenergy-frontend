/**
 * Configuración visual por tipo de animación
 */
const CONFIGS = {
    sun: {
        accent: 'Energía Solar',
        icon: '☀️',
        tags: ['☀️ Luz', '🌡️ Calor', '⚡ Electricidad'],
        fact: '¡Los paneles solares transforman la luz del sol directamente en energía eléctrica!',
        factIcon: '⚡',
        buildVisual(card) {
            card.innerHTML = `
        <div class="anim-sun-wrap">
          <div class="anim-sun-ring"></div>
          <div class="anim-sun-ring"></div>
          <div class="anim-sun-ring"></div>
          <div class="anim-sun-core">🌞</div>
        </div>
      `;
        },
    },

    lamp: {
        accent: 'Energía Eléctrica',
        icon: '💡',
        tags: ['💡 Focos', '🔌 Electrodomésticos', '🔋 Baterías'],
        fact: '¡Al encender un foco, la energía eléctrica se transforma en luz y calor!',
        factIcon: '💡',
        buildVisual(card) {
            const angles = [-60, -30, 0, 30, 60, 90, 120, 150];
            const rays = angles.map(r => `
        <div class="anim-lamp-ray"
             style="
               height:${50 + Math.random() * 30}px;
               top:50%; left:50%;
               translate:-50% -100%;
               --r:${r}deg;
               transform-origin:bottom center;
               transform:rotate(${r}deg);
               animation-delay:${Math.random() * .8}s;
             ">
        </div>
      `).join('');
            card.innerHTML = `
        <div class="anim-lamp-wrap">
          ${rays}
          <div class="anim-lamp-core">🔌</div>
        </div>
      `;
        },
    },

    rainbow: {
        accent: 'Energía Química',
        icon: '🔋',
        tags: ['🔋 Baterías', '🍎 Alimentos', '⛽ Combustible'],
        fact: '¡Tu cuerpo transforma la energía química de los alimentos en movimiento y calor!',
        factIcon: '🏃',
        buildVisual(card) {
            const bands = [
                { color: '#EF4444', delay: .1 },
                { color: '#F97316', delay: .2 },
                { color: '#06B6D4', delay: .3 },
                { color: '#3B82F6', delay: .4 },
                { color: '#6366F1', delay: .5 },
                { color: '#8B5CF6', delay: .6 },
                { color: '#EC4899', delay: .7 },
            ];
            card.innerHTML = `
        <div class="anim-rainbow-wrap">
          <div class="anim-prism">🔋</div>
          <div class="anim-rainbow-bands">
            ${bands.map(b => `
              <div class="anim-band"
                   style="background:${b.color};animation-delay:${b.delay}s;">
              </div>
            `).join('')}
          </div>
        </div>
      `;
        },
    },

    shadow: {
        accent: 'Energía Mecánica',
        icon: '⚙️',
        tags: ['🏃 Movimiento', '🎢 Posición', '⚙️ Máquinas'],
        fact: '¡Al frotar tus manos, la energía mecánica (movimiento) se transforma en térmica (calor)!',
        factIcon: '🔥',
        buildVisual(card) {
            card.innerHTML = `
        <div class="anim-shadow-wrap">
          <div class="anim-shadow-obj">⚙️</div>
          <div class="anim-shadow-ground"></div>
          <div class="anim-shadow-cast"></div>
        </div>
      `;
        },
    },

    glass: {
        accent: 'Energía Térmica',
        icon: '🔥',
        tags: ['🔥 Fuego', '☀️ Sol', '♨️ Fricción'],
        fact: '¡El calor se transmite de los objetos más calientes a los más fríos!',
        factIcon: '🌡️',
        buildVisual(card) {
            card.innerHTML = `
        <div class="anim-glass-wrap">
          <div class="anim-glass-col">
            <div class="anim-block opaque">🔥</div>
            <span class="anim-glass-label">Caliente</span>
          </div>
          <div class="anim-arrow">→</div>
          <div class="anim-glass-col">
            <div class="anim-block glass">🧊</div>
            <span class="anim-glass-label">Frío</span>
          </div>
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
    const cfg = CONFIGS[section.animation] ?? CONFIGS.sun;

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