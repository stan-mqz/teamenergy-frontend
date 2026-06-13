// src/js/components/section3.stats.js
import { fetchStats } from "../api/section3.api.js";

export const renderStats = async (container) => {
  container.innerHTML = `
            <p style="font-family:'Nunito',sans-serif; text-align:center; opacity:0.5; margin-top:2rem;">
                Cargando estadísticas colectivas de la clase...
            </p>
        `;

  try {
    const statsData = await fetchStats();

    if (!statsData || statsData.length === 0) {
      container.innerHTML = `
                    <p style="font-family:'Nunito',sans-serif; text-align:center; opacity:0.5; margin-top:2rem;">
                        No hay datos estadísticos acumulados todavía.
                    </p>
                `;
      return;
    }

    container.innerHTML = `
                <section style="
                    width: 100%;
                    border-radius: 36px;
                    padding: 4rem;
                    margin-top: 3rem;
                    background: rgba(255,255,255,0.025);
                    border: 1px solid rgba(255,255,255,0.08);
                    backdrop-filter: blur(20px);
                    position: relative;
                    overflow: hidden;
                ">
                    <!-- Decorative particle -->
                    <span style="
                        position:absolute; top:2rem; right:3rem;
                        font-size:1.8rem; opacity:0.15; pointer-events:none;
                        animation: floatB 6s ease-in-out infinite;
                    ">📈</span>

                    <!-- Header -->
                    <h2 style="
                        font-family:'Fredoka One',cursive;
                        font-size: clamp(2rem, 4vw, 3rem);
                        font-weight: 400;
                        color: #fff;
                        margin: 0 0 0.5rem;
                    ">📊 Estadísticas del Aula</h2>
                    <p style="
                        font-family:'Nunito',sans-serif;
                        font-size: 1rem;
                        opacity: 0.6;
                        margin: 0 0 2.5rem;
                        line-height: 1.6;
                    ">Interacciones registradas por todos los estudiantes para cada pregunta.</p>

                    <!-- Stats grid -->
                    <div style="display:grid; gap:1rem;">
                        ${statsData
                          .map((stat) => {
                            const total =
                              (stat.correctCount ?? 0) +
                              (stat.incorrectCount ?? 0);
                            const percentage =
                              total > 0
                                ? ((stat.correctCount / total) * 100).toFixed(1)
                                : 0;
                            const isGood = percentage >= 60;

                            return `
                                <div style="
                                    background: rgba(0,0,0,0.2);
                                    padding: 1.4rem;
                                    border-radius: 18px;
                                    border: 1.5px solid ${isGood ? "rgba(97,255,202,0.15)" : "rgba(255,122,0,0.15)"};
                                    border-left: 4px solid ${isGood ? "#61ffca" : "#ff7a00"};
                                ">
                                    <!-- Question ID + percentage -->
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                                        <span style="
                                            font-family:'Nunito',sans-serif;
                                            font-weight:800;
                                            font-size:0.9rem;
                                            color:#fff;
                                            opacity:0.85;
                                        ">Pregunta: <code style="
                                            background:rgba(255,255,255,0.06);
                                            padding:0.1rem 0.5rem;
                                            border-radius:6px;
                                            font-size:0.85rem;
                                        ">${stat.number}</code></span>
                                        <span style="
                                            font-family:'Fredoka One',cursive;
                                            font-size:1.3rem;
                                            color:${isGood ? "#61ffca" : "#ff9a3c"};
                                        ">${percentage}%</span>
                                    </div>

                                    <!-- Correct / Incorrect counts -->
                                    <div style="display:flex; gap:1.5rem; font-family:'Nunito',sans-serif; font-size:0.88rem; opacity:0.8; margin-bottom:0.75rem;">
                                        <span>✅ Correctas: <strong style="color:#4ade80;">${stat.correctCount ?? 0}</strong></span>
                                        <span>❌ Incorrectas: <strong style="color:#f87171;">${stat.incorrectCount ?? 0}</strong></span>
                                        <span style="opacity:0.5;">Total: <strong>${total}</strong></span>
                                    </div>

                                    <!-- Progress bar -->
                                    <div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden;">
                                        <div style="
                                            width:${percentage}%;
                                            height:100%;
                                            background: linear-gradient(90deg, #ff7a00, #61ffca);
                                            border-radius:3px;
                                            transition: width 0.8s ease;
                                        "></div>
                                    </div>
                                </div>
                            `;
                          })
                          .join("")}
                    </div>
                </section>
            `;
  } catch (error) {
    console.error("[renderStats] Error:", error);
    container.innerHTML = `
                <p style="font-family:'Nunito',sans-serif; text-align:center; color:#f87171; margin-top:2rem;">
                    Error al cargar las estadísticas.
                </p>
            `;
  }
};


function getRating(rate) {
    if (rate >= 60) return "good";
    if (rate >= 40) return "warn";
    return "bad";
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
 * Normaliza la respuesta de fetchStats al shape que usan los builders
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

/**
 * Equivalente a createStats pero para la sección 3.
 * Devuelve un <section> listo para appendear.
 */
export async function createStats3() {
    const section = document.createElement("section");
    section.classList.add("stats-section");

    section.innerHTML = `
        <div class="stats-header">
            <span class="stats-eyebrow">Sección 3 · El Calor</span>
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

    } catch (err) {
        console.error("[createStats3] Error:", err);
        const errEl = document.createElement("p");
        errEl.classList.add("stats-error");
        errEl.textContent = "No se pudieron cargar las estadísticas.";
        section.appendChild(errEl);
    }

    return section;
}