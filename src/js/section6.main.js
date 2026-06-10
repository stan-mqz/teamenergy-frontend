import "../css/section6.style.css";
import "../css/section6.hero.css";
import "../css/section6.sections.css";
import "../css/section6.quiz.css";
import "../css/glassmorphism-btn.css";
import "../css/lesson.navigation.css";

import { loadLightPage } from "./pages/section6.page";

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
            fill="rgba(184,111,79,0.08)"
        />
    </svg>
`;
document.body.appendChild(homeBtn);

loadLightPage();
