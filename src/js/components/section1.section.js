/* ═══════════════════════════════════════════════
   SECTION 1: SECTIONS COMPONENT — "Mecánica"
   Generación e integración de bloques interactivos por scroll
   ═══════════════════════════════════════════════ */

/**
 * Configuración visual didáctica por subconcepto de mecánica (2do Grado)
 * Transforma el entorno espacial por variables interactivas de movimiento y fuerza.
 */
const CONFIGS = {
    mechanics: {
        accent: 'Energía Mecánica',
        icon: '⚙️',
        tags: ['⚙️ Movimiento', '🌍 Entorno', '🎒 Experimentación'],
        fact: '¡La energía mecánica se divide en dos tipos: la potencial y la cinética!',
        factIcon: '💡',
        buildVisual(card) {
            // Recreamos la pizarra interactiva con la fórmula macro del libro de texto
            card.innerHTML = `
                <div class="s1-board" style="transform: scale(0.9);">
                    <div class="s1-formula-main" style="font-size: 2.2rem; color: var(--night);">
                        E<sub>m</sub> = E<sub>p</sub> + E<sub>c</sub>
                    </div>
                </div>
            `;
        },
    },

    potential: {
        accent: 'Energía Potencial',
        icon: '🥎',
        tags: ['🥎 Altura específica', '🛑 Objeto en reposo', '⚖️ Masa y posición'],
        fact: '¡Las esferas de plastilina, antes de soltarlas al agua, poseen energía potencial!',
        factIcon: '🔵',
        buildVisual(card) {
            // Simulación visual interactiva de altura y energía almacenada
            card.innerHTML = `
                <div class="anim-shadow-wrap" style="display:flex; flex-direction:column; align-items:center; gap: 10px;">
                    <div class="s1-formula-main" style="font-family:var(--font-display); font-size:4rem; color:var(--sun);">🥎</div>
                    <div style="font-family:var(--font-body); font-weight:800; color:var(--text-bright); font-size:1.1rem; text-transform:uppercase; letter-spacing:1px;">Altura (h)</div>
                </div>
            `;
        },
    },

    kinetic: {
        accent: 'Energía Cinética',
        icon: '🏃',
        tags: ['🌊 Caída libre', '⚡ Movimiento activo', '📦 Depende de la masa'],
        fact: '¡Cuando dejamos caer las esferas, obtienen energía cinética debido al movimiento!',
        factIcon: '🚀',
        buildVisual(card) {
            // Estructura cinética con efecto de velocidad (Hereda la animación de saltos)
            card.innerHTML = `
                <div class="anim-shadow-wrap">
                    <div class="anim-shadow-obj">🔴</div>
                    <div class="anim-shadow-ground" style="background:rgba(255,255,255,0.2);"></div>
                    <div class="anim-shadow-cast"></div>
                </div>
            `;
        },
    },

    joule: {
        accent: 'Notación y Medida',
        icon: '📐',
        tags: ['🔢 Valor numérico', '🧪 Unidad Joule', '🔤 Expresado con J'],
        fact: '¡Puedes escribir la energía de manera numérica y colocarle la medida Joule (J)!',
        factIcon: '📝',
        buildVisual(card) {
            // Representación de la caja de anotaciones que aparece en el libro de texto
            card.innerHTML = `
                <div style="background:#ffffff; padding:20px; border-radius:16px; border:2px dashed var(--sky); text-align:center; box-shadow:0 10px 20px rgba(0,0,0,0.15);">
                    <span style="font-family:var(--font-display); font-size:1.5rem; color:var(--sky-deep); display:block; margin-bottom:5px;">Notación</span>
                    <div style="font-family:var(--font-display); font-size:3.5rem; color:var(--mint-deep);">100 J</div>
                </div>
            `;
        },
    }
};

/** Contador modular aislado para la numeración de los bloques de Mecánica */
let s1SectionCounter = 0;

/**
 * Registra el IntersectionObserver para activar las transiciones premium al hacer scroll
 * @param {HTMLElement} el - Sección contenedora
 * @param {HTMLElement} card - Tarjeta visual interna
 */
function observeS1Section(el, card) {
    const io = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                el.classList.add('in-view'); // Activa animaciones s1SlideFromLeft/Right
                setTimeout(() => card.classList.add('pop-in'), 300);
                io.disconnect(); // Desconecta para asegurar rendimiento óptimo
            }
        },
        { threshold: 0.15 }
    );
    io.observe(el);
}

/**
 * Fábrica dinámica encargada de construir cada bloque temático de la Sección 1
 * @param {Object} section - Nodo de datos provisto por el controlador de la API
 * @returns {HTMLElement} Elemento estructurado listo para ser inyectado en el DOM
 */
export function createSection(section) {
    s1SectionCounter++;
    
    // Fallback seguro en caso de que el backend provea un tipo de animación no mapeado
    const cfg = CONFIGS[section.animation] ?? CONFIGS.mechanics;

    // Instanciación del nodo de sección acoplado al layout asimétrico
    const el = document.createElement('section');
    el.classList.add('s1-planet-section');
    el.dataset.anim = section.animation;

    // Mapeo dinámico de píldoras / tags infantiles
    const tagsHtml = cfg.tags.map(t =>
        `<span class="s1-planet-tag">${t}</span>`
    ).join('');

    // Inyección de textos educativos, datos curiosos y metadatos
    const textContainer = document.createElement('div');
    textContainer.classList.add('s1-planet-text-group');
    textContainer.innerHTML = `
        <p class="s1-planet-tag" style="border:none; background:rgba(0,229,160,0.1); color:var(--mint); width:max-content;">
            Módulo 0${s1SectionCounter} · ${cfg.accent}
        </p>
        <h2 class="s1-main-title" style="text-align:left; font-size:clamp(2rem, 4vw, 2.8rem); color:#ffffff;">
            ${section.title}
        </h2>
        <p class="s1-subtitle" style="text-align:left; color:var(--text-soft); font-size:1.1rem; font-weight:600; line-height:1.6; text-shadow:none;">
            ${section.description}
        </p>
        <div class="s1-planet-tags">${tagsHtml}</div>
        <div class="s1-fun-fact">
            <span class="s1-fun-fact-icon">${cfg.factIcon}</span>
            <span>${cfg.fact}</span>
        </div>
    `;

    // Instanciación y ensamblado de la tarjeta gráfica interactiva
    const visualContainer = document.createElement('div');
    visualContainer.classList.add('planet-visual'); // Mantiene compatibilidad con la envoltura estructural

    const card = document.createElement('div');
    card.classList.add('visual-card'); // Usa los estilos de tarjeta animada de la app
    cfg.buildVisual(card);
    visualContainer.appendChild(card);

    // Inyección secuencial en la cuadrícula
    el.appendChild(textContainer);
    el.appendChild(visualContainer);

    // Activación de observadores de intersección
    observeS1Section(el, card);
    
    return el;
}