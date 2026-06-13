import { getStats } from "../api/section6.api";

/**
 * Determina clase de color según tasa de aciertos
 * @param {number} rate
 * @returns {'good'|'warn'|'bad'}
 */
function getRating(rate) {
    if (rate >= 60) return "good";
    if (rate >= 40) return "warn";
    return "bad";
}

/**
 * Inyecta Chart.js desde CDN si no está cargado aún
 * @returns {Promise<void>}
 */
export function loadChartJs() {
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
 * Tarjetas de métricas globales
 * @param {Object[]} data
 * @returns {HTMLElement}
 */
function buildMetrics(data) {
    const totalCorrect = data.reduce((s, d) => s + d.correct_count, 0);
    const totalIncorrect = data.reduce((s, d) => s + d.incorrect_count, 0);
    const totalAttempts = totalCorrect + totalIncorrect;
    const globalRate = totalAttempts
        ? Math.round((totalCorrect / totalAttempts) * 100)
        : 0;
    const rating = getRating(globalRate);

    const grid = document.createElement("div");
    grid.classList.add("stats-metric-grid");

    grid.innerHTML = `
        <div class="stats-metric-card">
            <p class="stats-metric-label">Total respuestas</p>
            <p class="stats-metric-value">${totalAttempts}</p>
        </div>
        <div class="stats-metric-card">
            <p class="stats-metric-label">Correctas</p>
            <p class="stats-metric-value good">${totalCorrect}</p>
        </div>
        <div class="stats-metric-card">
            <p class="stats-metric-label">Incorrectas</p>
            <p class="stats-metric-value bad">${totalIncorrect}</p>
        </div>
        <div class="stats-metric-card">
            <p class="stats-metric-label">Tasa global</p>
            <p class="stats-metric-value ${rating}">${globalRate}%</p>
        </div>
    `;

    return grid;
}

/**
 * Cards por pregunta con barra de progreso animada
 * @param {Object[]} data
 * @returns {HTMLElement}
 */
function buildQuestionCards(data) {
    const list = document.createElement("div");
    list.classList.add("stats-q-list");

    data.forEach((d, i) => {
        const rate = parseFloat(d.success_rate);
        const rating = getRating(rate);
        const total = d.correct_count + d.incorrect_count;

        const card = document.createElement("div");
        card.classList.add("stats-q-card");

        card.innerHTML = `
            <div class="stats-q-top">
                <span class="stats-q-num">P${i + 1}</span>
                <p class="stats-q-text">${d.question}</p>
                <span class="stats-q-badge ${rating}">${rate.toFixed(1)}%</span>
            </div>
            <div class="stats-q-bar-row">
                <div class="stats-q-bar-track">
                    <div
                        class="stats-q-bar-fill ${rating}"
                        data-width="${rate}"
                        style="width: 0%"
                    ></div>
                </div>
                <span class="stats-q-total">${total} resp.</span>
            </div>
            <div class="stats-q-counts">
                <span class="stats-q-count">
                    <span class="stats-q-dot good"></span>
                    ${d.correct_count} correctas
                </span>
                <span class="stats-q-count">
                    <span class="stats-q-dot bad"></span>
                    ${d.incorrect_count} incorrectas
                </span>
            </div>
        `;

        list.appendChild(card);
    });

    // Animar barras después del render
    requestAnimationFrame(() => {
        setTimeout(() => {
            list.querySelectorAll(".stats-q-bar-fill").forEach((bar, idx) => {
                setTimeout(() => {
                    bar.style.width = bar.dataset.width + "%";
                }, idx * 150);
            });
        }, 400);
    });

    return list;
}

/**
 * Gráfico de barras agrupadas con Chart.js
 * @param {Object[]} data
 * @returns {HTMLElement}
 */
function buildChart(data) {
    const wrap = document.createElement("div");
    wrap.classList.add("stats-chart-wrap");

    wrap.innerHTML = `
        <div class="stats-chart-legend">
            <span class="stats-legend-item">
                <span class="stats-legend-sq good"></span>Correctas
            </span>
            <span class="stats-legend-item">
                <span class="stats-legend-sq bad"></span>Incorrectas
            </span>
        </div>
        <div class="stats-canvas-wrap">
            <canvas
                id="stats-bar-chart"
                role="img"
                aria-label="Gráfico de barras con respuestas correctas e incorrectas por pregunta"
            >${data.map((d, i) =>
        `P${i + 1}: ${d.correct_count} correctas, ${d.incorrect_count} incorrectas.`
    ).join(" ")}</canvas>
        </div>
    `;

    requestAnimationFrame(() => {
        const canvas = wrap.querySelector("#stats-bar-chart");
        if (!canvas || !window.Chart) return;

        new window.Chart(canvas, {
            type: "bar",
            data: {
                labels: data.map((_, i) => `P${i + 1}`),
                datasets: [
                    {
                        label: "Correctas",
                        data: data.map(d => d.correct_count),
                        backgroundColor: "#7ccba2",
                        borderRadius: 6,
                        barPercentage: 0.5,
                        categoryPercentage: 0.6,
                    },
                    {
                        label: "Incorrectas",
                        data: data.map(d => d.incorrect_count),
                        backgroundColor: "#f28b82",
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
                            color: "rgba(36,54,75,.52)",
                            font: { size: 12, family: "'Nunito', sans-serif" },
                            autoSkip: false,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: "rgba(79,159,216,.12)" },
                        ticks: {
                            color: "rgba(36,54,75,.52)",
                            font: { size: 12, family: "'Nunito', sans-serif" },
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
 * Crea y retorna la sección completa de estadísticas
 * @returns {Promise<HTMLElement>}
 */
export async function createStats() {
    await loadChartJs();

    const section = document.createElement("section");
    section.classList.add("stats-section");

    section.innerHTML = `
        <div class="stats-header">
            <span class="stats-eyebrow">Sección 6 · La Luz</span>
            <h2 class="stats-title">Estadísticas del quiz</h2>
        </div>
    `;

    try {
        const response = await getStats();

        if (!response.ok || !Array.isArray(response.data)) {
            throw new Error("Respuesta inválida");
        }

        const data = response.data;

        section.appendChild(buildMetrics(data));

        const qLabel = document.createElement("p");
        qLabel.classList.add("stats-section-label");
        qLabel.textContent = "Rendimiento por pregunta";
        section.appendChild(qLabel);

        section.appendChild(buildQuestionCards(data));

        const chartLabel = document.createElement("p");
        chartLabel.classList.add("stats-section-label");
        chartLabel.textContent = "Correctas vs incorrectas";
        section.appendChild(chartLabel);

        section.appendChild(buildChart(data));

    } catch (err) {
        console.error("Stats error:", err);
        const errEl = document.createElement("p");
        errEl.classList.add("stats-error");
        errEl.textContent = "No se pudieron cargar las estadísticas.";
        section.appendChild(errEl);
    }

    return section;
}
