import "../css/section6.style.css";
import "../css/stats.css";
import "../css/glassmorphism-btn.css";
import "../css/lesson.navigation.css";

import { createStats6 } from "./components/section6.stats.js";
import { createLessonNavigation } from "./components/lesson.navigation.js";
import { createStats3, renderStats } from "./components/section3.stats.js";
import { createStats5 } from "./components/section5.stats.js";
import { createStats4 } from "./components/section4.stats.js";
import { createStats2 } from "./components/section2.stats.js";
import { createStats1 } from "./components/section1.stats.js";


const homeBtn = document.createElement("a");
homeBtn.classList.add("home-btn");
homeBtn.href = "/index.html";
homeBtn.title = "Volver al menú";
homeBtn.setAttribute("aria-label", "Volver al menú principal");
homeBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M3 10.5L12 3L21 10.5V20C21 20.55 20.55 21 20 21H15V15H9V21H4C3.45 21 3 20.55 3 20V10.5Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linejoin="round"
            fill="rgba(79,159,216,0.08)"
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
            color: rgba(36,54,75,.58);
            font-family: 'Nunito', sans-serif;
        ">
            <div style="font-size: 4rem; animation: spin 2s linear infinite;">📊</div>
            <p style="font-size: .9rem; letter-spacing: 2px; text-transform: uppercase; font-weight: 700;">
                Cargando estadísticas...
            </p>
        </div>
        <style>@keyframes spin { to { rotate: 360deg; } }</style>
    `;

  const [stats1, stats2, stats3, stats4, stats5, stats6] = await Promise.all([createStats1(), createStats2(), createStats3(), createStats4(), createStats5(), createStats6()]);

  app.innerHTML = "";
  app.appendChild(stats1);
  app.appendChild(stats2);
  app.appendChild(stats3);
  app.appendChild(stats4);
  app.appendChild(stats5);
  app.appendChild(stats6);
  //   const statsEl = await createStats();
  //   const statsAppContainer = document.getElementById("stats-app");
  //   renderStats(statsAppContainer);

  //   app.innerHTML = "";
  //   app.appendChild(statsEl);
  //   app.appendChild(statsAppContainer)
}

loadStatsPage();
