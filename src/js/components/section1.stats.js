/* ═══════════════════════════════════════════════
   SECTION 1: STATS COMPONENT — "Mecánica"
   Renderizado de analíticas de rendimiento con Chart.js
   ═══════════════════════════════════════════════ */

import { getStats } from "../api/section1.api";

/**
 * Determina la clase de color según la tasa de aciertos en física
 * @param {number} rate - Porcentaje de respuestas correctas
 * @returns {'good'|'warn'|'bad'} Clasificación semántica
 */
function getS1Rating(rate) {
    if (rate >= 60) return "good";
    if (rate >= 40) return "warn";
    return "bad";
}

/**
 * Inyecta de forma segura Chart.js desde CDN si el ecosistema global no lo ha inicializado
 * @returns {Promise<void>} Promesa de carga del script asíncrono
 */
function loadS1ChartJs() {
    return new Promise((resolve, reject) => {
        if (window.Chart) { resolve(); return; }
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

/**
 * Construye la cuadrícula superior con las métricas globales de Mecánica
 * @param {Object[]} data - Arreglo histórico provisto por el servidor
 * @returns {HTMLElement} Grid de tarjetas analíticas estilizado
 */
function buildS1Metrics(data) {
    const totalCorrect = data.reduce((s, d) => s + d.correct_count, 0);
    const totalIncorrect = data.reduce((s, d) => s + d.incorrect_count, 0);
    const totalAttempts = totalCorrect + totalIncorrect;
    const globalRate = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    const rating = getS1Rating(globalRate);

    const grid = document.createElement("div");
    grid.classList.add("s1-stats-metric-grid");

    grid.innerHTML = `
        <div class="s1-stats-metric-card">
            <p class="s1-stats-metric-label">Total respuestas</p>
            <p class="s1-stats-metric-value">${totalAttempts}</p>
        </div>
        <div class="s1-stats-metric-card">
            <p class="s1-stats-metric-label">Correctas</p>
            <p class="s1-stats-metric-value s1-good">${totalCorrect}</p>
        </div>
        <div class="s1-stats-metric-card">
            <p class="s1-stats-metric-label">Incorrectas</p>
            <p class="s1-stats-metric-value s1-bad">${totalIncorrect}</p>
        </div>
        <div class="s1-stats-metric-card">
            <p class="s1-stats-metric-label">Tasa de éxito</p>
            <p class="s1-stats-metric-value s1-${rating}">${globalRate}%</p>
        </div>
    `;

    return grid;
}

/**
 * Crea las tarjetas individuales por pregunta evaluada con animaciones lineales
 * @param {Object[]} data - Banco de preguntas analizadas
 * @returns {HTMLElement} Lista con barras dinámicas de progreso
 */
function buildS1QuestionCards(data) {
    const list = document.createElement("div");
    list.classList.add("s1-stats-q-list");

    data.forEach((d, i) => {
        const rate = parseFloat(d.success_rate);
        const rating = getS1Rating(rate);
        const total = d.correct_count + d.incorrect_count;

        const card = document.createElement("div");
        card.classList.add("s1-stats-q-card");

        card.innerHTML = `
            <div class="s1-stats-q-top">
                <span class="s1-stats-q-num">Desafío 0${i + 1}</span>
                <p class="s1-stats-q-text">${d.question}</p>
                <span class="s1-stats-q-badge s1-${rating}">${rate.toFixed(1)}%</span>
            </div>
            <div class="s1-stats-q-bar-row">
                <div class="s1-stats-q-bar-track">
                    <div
                        class="s1-stats-q-bar-fill s1-${rating}"
                        data-width="${rate}"
                        style="width: 0%"
                    ></div>
                </div>
                <span class="s1-stats-q-total">${total} intentos</span>
            </div>
            <div class="s1-stats-q-counts">
                <span class="s1-stats-q-count">
                    <span class="s1-stats-q-dot s1-good"></span>
                    ${d.correct_count} aciertos
                </span>
                <span class="s1-stats-q-count">
                    <span class="s1-stats-q-dot s1-bad"></span>
                    ${d.incorrect_count} errores
                </span>
            </div>
        `;

        list.appendChild(card);
    });

    // Disparador secuencial controlado por marcos de animación nativos
    requestAnimationFrame(() => {
        setTimeout(() => {
            list.querySelectorAll(".s1-stats-q-bar-fill").forEach((bar, idx) => {
                setTimeout(() => {
                    bar.style.width = bar.dataset.width + "%";
                }, idx * 150);
            });
        }, 400);
    });

    return list;
}

/**
 * Inicializa y configura el gráfico agrupado de Chart.js adaptado a tus colores de root
 * @param {Object[]} data - Métricas por pregunta
 * @returns {HTMLElement} Envoltura con el Canvas renderizado
 */
function buildS1Chart(data) {
    const wrap = document.createElement("div");
    wrap.classList.add("s1-stats-chart-wrap");

    wrap.innerHTML = `
        <div class="s1-stats-chart-legend">
            <span class="s1-stats-legend-item">
                <span class="s1-stats-legend-sq s1-good"></span>Aciertos
            </span>
            <span class="s1-stats-legend-item">
                <span class="s1-stats-legend-sq s1-bad"></span>Errores
            </span>
        </div>
        <div class="s1-stats-canvas-wrap">
            <canvas id="s1-stats-bar-chart" role="img" aria-label="Gráfico de rendimiento de energía mecánica S1"></canvas>
        </div>
    `;

    requestAnimationFrame(() => {
        const canvas = wrap.querySelector("#s1-stats-bar-chart");
        if (!canvas || !window.Chart) return;

        new window.Chart(canvas, {
            type: "bar",
            data: {
                labels: data.map((_, i) => `Desafío ${i + 1}`),
                datasets: [
                    {
                        label: "Correctas",
                        data: data.map(d => d.correct_count),
                        backgroundColor: "#00E5A0", // Color var(--mint) alegre unificado
                        borderRadius: 6,
                        barPercentage: 0.5,
                        categoryPercentage: 0.6,
                    },
                    {
                        label: "Incorrectas",
                        data: data.map(d => d.incorrect_count),
                        backgroundColor: "#FF6B6B", // Color var(--coral) suave unificado
                        borderRadius: 6,
                        barPercentage: 0.5,
                        categoryPercentage: 0.6,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}`,
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: "rgba(255,255,255,.7)", // Incrementado a .7 para mayor visibilidad infantil
                            font: { size: 12, family: "'Fredoka', sans-serif" },
                            autoSkip: false,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: "rgba(255,255,255,.15)" }, // Incrementado a .15 para marcar mejor las líneas guía
                        ticks: {
                            color: "rgba(255,255,255,.7)", // Incrementado a .7 para lectura clara de las escalas
                            font: { size: 12, family: "'Fredoka', sans-serif" },
                            stepSize: 5,
                            precision: 0,
                        },
                    },
                },
            },
        });
    });

    return wrap;
}

/**
 * Factoría asíncrona principal para inyectar la vista global de Estadísticas en Mecánica
 * @returns {Promise<HTMLElement>} Nodo estructural completo de Analíticas
 */
export async function createStats() {
    // Garantiza la inyección y disponibilidad de la librería Chart en el Objeto Window
    await loadS1ChartJs();

    const section = document.createElement("section");
    section.classList.add("s1-stats-section");

    section.innerHTML = `
        <div class="s1-stats-header">
            <span class="s1-stats-eyebrow">Módulo 01 · Mecánica y Fuerzas</span>
            <h2 class="s1-stats-title">Panel de Rendimiento Global</h2>
        </div>
    `;

    try {
        const response = await getStats();

        if (!response || !response.ok || !Array.isArray(response.data)) {
            throw new Error("Estructura de datos rota");
        }

        const data = response.data;

        // Inyección modular de componentes estructurados
        section.appendChild(buildS1Metrics(data));

        const qLabel = document.createElement("p");
        qLabel.classList.add("s1-stats-section-label");
        qLabel.textContent = "Estadística detallada por ejercicio";
        section.appendChild(qLabel);

        section.appendChild(buildS1QuestionCards(data));

        const chartLabel = document.createElement("p");
        chartLabel.classList.add("s1-stats-section-label");
        chartLabel.textContent = "Balance comparativo de resolución";
        section.appendChild(chartLabel);

        section.appendChild(buildS1Chart(data));

    } catch (err) {
        console.error("Mecánica Stats Error:", err);
        const errEl = document.createElement("p");
        errEl.classList.add("s1-stats-error");
        errEl.textContent = "⚠️ No se pudieron sincronizar las estadísticas de la Sección 1.";
        section.appendChild(errEl);
    }

    return section;
}