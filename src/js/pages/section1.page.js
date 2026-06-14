import { createQuiz } from "../components/section1.quiz.js";
import { createStats } from "../components/section1.stats.js";

export async function loadMechanicsPage() {
  const app = document.getElementById("app");

  try {
    console.log("Inicializando lógica del juego de Mecánica...");

   
    await createQuiz();

   
    await createStats();

  } catch (err) {
    console.error(err);
    // Si algo falla de verdad, muestra el mensaje limpio con el color coral unificado
    app.innerHTML = `<p style="color: var(--coral, #FF6B6B); text-align: center; margin-top: 20px;">Error cargando la sección</p>`;
  }
}