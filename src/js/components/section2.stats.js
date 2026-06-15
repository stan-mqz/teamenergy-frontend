import { fetchStats } from "../api/section2.api.js";

function getRating(rate) {
    if (rate >= 60) return "good";
    if (rate >= 40) return "warn";
    return "bad";
}

let chartJsPromise = null;

function loadChartJs() {
    if (window.Chart) return Promise.resolve();
    if (chartJsPromise) return chartJsPromise;
    chartJsPromise = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
    return chartJsPromise;
}

function buildMetrics(data) {
    const totalCorrect   = data.reduce((s, d) => s + d.correct_count, 0);
    const totalIncorrect = data.reduce((s, d) => s + d.incorrect_count, 0);
    const totalAttempts  = totalCorrect + totalIncorrect;
    const globalRate     = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    const rating         = getRating(globalRate);

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

function buildQuestionCards(data) {
    const list = document.createElement("div");
    list.classList.add("stats-q-list");

    data.forEach((d, i) => {
        const rate   = parseFloat(d.success_rate);
        const rating = getRating(rate);
        const total  = d.correct_count + d.incorrect_count;

        const card = document.createElement("div");
        card.classList.add("stats-q-card");

        card.innerHTML = `
            <div class="stats-q-top">
                <span class="stats-q-num">P${d.number || (i + 1)}</span>
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
                id="stats-bar-chart-2"
                role="img"
                aria-label="Gráfico de barras con respuestas correctas e incorrectas por pregunta"
            >${data.map((d, i) =>
        `P${i + 1}: ${d.correct_count} correctas, ${d.incorrect_count} incorrectas.`
    ).join(" ")}</canvas>
        </div>
    `;

    requestAnimationFrame(() => {
        const canvas = wrap.querySelector("#stats-bar-chart-2");
        if (!canvas || !window.Chart) return;

        new window.Chart(canvas, {
            type: "bar",
            data: {
                labels: data.map((_, i) => `P${i + 1}`),
                datasets: [
                    {
                        label: "Correctas",
                        data: data.map(d => d.correct_count),
                        backgroundColor: "#00E5A0",
                        borderRadius: 6,
                        barPercentage: 0.5,
                        categoryPercentage: 0.6,
                    },
                    {
                        label: "Incorrectas",
                        data: data.map(d => d.incorrect_count),
                        backgroundColor: "#FF6B6B",
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
                            color: "rgba(255,255,255,.4)",
                            font: { size: 12, family: "'Nunito', sans-serif" },
                            autoSkip: false,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: "rgba(255,255,255,.06)" },
                        ticks: {
                            color: "rgba(255,255,255,.4)",
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
 * Normaliza la respuesta de fetchStats al formato que usan los constructores
 */
function normalize(raw) {
    return raw.map(item => ({
        questionId:      item.questionId,
        question:        item.question,
        correct_count:   item.correctCount   ?? 0,
        incorrect_count: item.incorrectCount ?? 0,
        success_rate:    item.success_rate   ?? "0.00",
        number:          item.number,
    }));
}

export async function createStats2() {
    await loadChartJs();

    const section = document.createElement("section");
    section.classList.add("stats-section");

    section.innerHTML = `
        <div class="stats-header">
            <span class="stats-eyebrow">Sección 2 · Energía Eléctrica</span>
            <h2 class="stats-title">Estadísticas del quiz</h2>
        </div>
    `;

    try {
        const raw = await fetchStats();
        const data = normalize(Array.isArray(raw) ? raw : raw?.data ?? []);

        if (data.length === 0) throw new Error("Sin datos");

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
        console.error("[createStats2] Error:", err);
        const errEl = document.createElement("p");
        errEl.classList.add("stats-error");
        errEl.textContent = "No se pudieron cargar las estadísticas.";
        section.appendChild(errEl);
    }

    return section;
}