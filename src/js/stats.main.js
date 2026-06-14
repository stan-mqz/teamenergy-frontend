import "../css/section6.style.css";
import "../css/stats.css";
import "../css/glassmorphism-btn.css";

import { createStats } from "./components/section6.stats";

const homeBtn = document.createElement("a");
homeBtn.classList.add("home-btn");
homeBtn.href = "/index.html";
homeBtn.title = "Volver al menú";
homeBtn.setAttribute("aria-label", "Volver al menú principal");
homeBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
            stroke="rgba(255,255,255,0.9)"
            stroke-width="1.8"
            stroke-linejoin="round"
            fill="rgba(255,255,255,0.08)"
        />
    </svg>
`;
document.body.appendChild(homeBtn);

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