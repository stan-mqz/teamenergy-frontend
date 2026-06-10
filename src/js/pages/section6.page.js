import { getSections } from '../api/section6.api';
import { createHero } from '../components/section6.hero';
import { createSection } from '../components/section6.section';
import { createQuiz } from "../components/section6.quiz";
import { createLessonNavigation } from "../components/lesson.navigation";


function showLoader(app) {
  app.innerHTML = `
    <div style="
      min-height:100vh; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:1.2rem;
      background:#f6efe4; color:rgba(56,43,34,.58);
      font-family:'Nunito',sans-serif;
    ">
      <div style="font-size:4rem;animation:spin 2s linear infinite;">☀️</div>
      <p style="font-size:.9rem;letter-spacing:2px;text-transform:uppercase;font-weight:700;">
        Cargando la luz...
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
      background:#f6efe4; color:#382b22; font-family:'Nunito',sans-serif;
      text-align:center; padding:2rem;
    ">
      <div style="font-size:4rem;">😟</div>
      <h2 style="font-size:1.8rem;font-weight:800;">¡Algo salió mal!</h2>
      <p style="opacity:.6;max-width:380px;font-weight:600;line-height:1.6;">
        No pudimos cargar el contenido. Asegúrate de que el servidor esté encendido.
      </p>
      <button onclick="location.reload()" style="
        margin-top:1rem; padding:12px 28px; border-radius:999px;
        border:1.5px solid rgba(184,111,79,.35); background:rgba(215,168,77,.16);
        color:#9f543f; font-size:1rem; font-weight:700; cursor:pointer;
        font-family:'Nunito',sans-serif; transition:background .2s;
      ">Reintentar</button>
    </div>
  `;
}

export async function loadLightPage() {
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
    app.appendChild(createLessonNavigation(6));


  } catch (err) {
    console.error(err);
    showError(app);
  }
}
