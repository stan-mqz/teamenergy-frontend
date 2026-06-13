// src/js/pages/section3.page.js
import { fetchQuestions } from "../api/section3.api.js";
import { renderQuiz } from "../components/section3.quiz.js";
import { renderStats } from "../components/section3.stats.js";

export const initSection3Page = async () => {
  const quizAppContainer = document.getElementById("quiz-app");
  const statsAppContainer = document.getElementById("stats-app");

  try {
    // 1. Obtener las preguntas desde el Backend
    const questions = await fetchQuestions();

    // 2. Renderizar el cuestionario interactivo analítico
    renderQuiz(quizAppContainer, questions, () => {
      // Callback: Cuando completen el quiz con éxito, refresca las estadísticas colectivas
    });
  } catch (error) {
    quizAppContainer.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <p style="color: #ef4444; font-weight: bold;">Error al conectar con el servidor backend.</p>
                <p style="opacity: 0.7; font-size: 0.9rem;">Asegúrate de que la API de Node.js se esté ejecutando en el puerto 3000.</p>
            </div>
        `;
  }
};
