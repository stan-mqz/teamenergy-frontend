import { getStats } from "../api/section1.api.js";

export async function createStats() {
    const section = document.createElement("section");
    section.classList.add("stats-section");

    section.innerHTML = `
        <div class="stats-header">
            <span class="stats-eyebrow">Sección 1 · Mecánica</span>
            <h2 class="stats-title">🏆 Mejores puntajes</h2>
        </div>
    `;

    try {
        const response = await getStats();

        // S1 stats devuelve { ok, data: [...leaderboard] }
        if (!response.ok || !Array.isArray(response.data)) {
            throw new Error("Respuesta inválida");
        }

        const data = response.data;

        if (!data.length) {
            const empty = document.createElement("p");
            empty.classList.add("stats-error");
            empty.textContent = "Aún no hay puntajes registrados. ¡Sé el primero!";
            section.appendChild(empty);
            return section;
        }

        const list = document.createElement("div");
        list.classList.add("stats-q-list");

        data.forEach((entry, i) => {
            const card = document.createElement("div");
            card.classList.add("stats-q-card");

            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
            const ratingClass = entry.score >= 80 ? "good" : entry.score >= 50 ? "warn" : "bad";
            const pct = entry.score; // ya viene sobre 100

            card.innerHTML = `
                <div class="stats-q-top">
                    <span class="stats-q-num">${medal}</span>
                    <p class="stats-q-text">${entry.student_name}</p>
                    <span class="stats-q-badge ${ratingClass}">${entry.score} pts</span>
                </div>
                <div class="stats-q-bar-row">
                    <div class="stats-q-bar-track">
                        <div
                            class="stats-q-bar-fill ${ratingClass}"
                            data-width="${pct}"
                            style="width: 0%"
                        ></div>
                    </div>
                    <span class="stats-q-total">${entry.correct_answers} correctas</span>
                </div>
            `;

            list.appendChild(card);
        });

        // Animar barras
        requestAnimationFrame(() => {
            setTimeout(() => {
                list.querySelectorAll(".stats-q-bar-fill").forEach((bar, idx) => {
                    setTimeout(() => {
                        bar.style.width = bar.dataset.width + "%";
                    }, idx * 150);
                });
            }, 400);
        });

        section.appendChild(list);

    } catch (err) {
        console.error("Stats S1 error:", err);
        const errEl = document.createElement("p");
        errEl.classList.add("stats-error");
        errEl.textContent = "No se pudieron cargar las estadísticas.";
        section.appendChild(errEl);
    }

    return section;
}