import { getSections } from '../api/section4.api';
import { createHero } from '../components/section4.hero';
import { createSection } from '../components/section4.section';
import { createQuiz } from "../components/section4.quiz";
import { createStats } from "../components/section4.stats";
import { createLessonNavigation } from "../components/lesson.navigation";


function showLoader(app) {
  app.innerHTML = `
    <div style="
      min-height:100vh; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:1.2rem;
      background:#06061a; color:rgba(255,255,255,.5);
      font-family:'Nunito',sans-serif;
    ">
      <div style="font-size:4rem;animation:spin 2s linear infinite;">💧</div>
      <p style="font-size:.9rem;letter-spacing:2px;text-transform:uppercase;font-weight:700;">
        Cargando el agua...
      </p>
    </div>
    <style>@keyframes spin{to{rotate:360deg}}</style>
  `;
}

function showError(app) {
  app.innerHTML = `
    <div style="
      min-height:100vh; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:1rem;
      background:#06061a; color:#fff; font-family:'Nunito',sans-serif;
      text-align:center; padding:2rem;
    ">
      <div style="font-size:4rem;">😟</div>
      <h2 style="font-size:1.8rem;font-weight:800;">¡Algo salió mal!</h2>
      <p style="opacity:.6;max-width:380px;font-weight:600;line-height:1.6;">
        No pudimos cargar el contenido. Asegúrate de que el servidor esté encendido.
      </p>
      <button onclick="location.reload()" style="
        margin-top:1rem; padding:12px 28px; border-radius:999px;
        border:1.5px solid rgba(255,217,61,.4); background:rgba(255,217,61,.1);
        color:#FFD93D; font-size:1rem; font-weight:700; cursor:pointer;
        font-family:'Nunito',sans-serif; transition:background .2s;
      ">Reintentar</button>
    </div>
  `;
}

export async function loadWaterPage() {
  const app = document.querySelector('#app');
  showLoader(app);

  try {
    const response = await getSections();
    if (!response.ok || !Array.isArray(response.data)) throw new Error('API error');

    app.innerHTML = '';

    const sorted = [...response.data].sort((a, b) => a.position_order - b.position_order);

    sorted.forEach(section => {
      const el = section.type === 'hero'
        ? createHero(section)
        : createSection(section);
      app.appendChild(el);
    });
    const quiz = await createQuiz();
    app.appendChild(quiz);
    app.appendChild(createLessonNavigation(4));


  } catch (err) {
    console.error(err);
    showError(app);
  }
}