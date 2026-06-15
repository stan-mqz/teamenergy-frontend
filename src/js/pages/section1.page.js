import { createQuiz } from '../components/section1.quiz.js';
import { createStats1 } from '../components/section1.stats.js';

export async function loadMechanicsPage() {
    try {
        await createQuiz();
        await createStats();
        app.appendChild(createLessonNavigation(1));
    } catch (err) {
        console.error("Error cargando la sección 1:", err);
    }
}