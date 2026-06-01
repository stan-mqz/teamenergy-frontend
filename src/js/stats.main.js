import "../css/section6.style.css";
import "../css/stats.css";

import { createStats } from "./components/section6.stats";

async function loadStatsPage() {
    const app = document.querySelector("#app");

    app.innerHTML = `
        <div style="
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.2rem;
            color: rgba(255,255,255,.5);
            font-family: 'Nunito', sans-serif;
        ">
            <div style="font-size: 4rem; animation: spin 2s linear infinite;">📊</div>
            <p style="font-size: .9rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 700;">
                Cargando estadísticas...
            </p>
        </div>
        <style>@keyframes spin { to { rotate: 360deg; } }</style>
    `;

    const statsEl = await createStats();

    app.innerHTML = "";
    app.appendChild(statsEl);
}

loadStatsPage();