import { createQuiz } from '../components/section1.quiz.js';
import { createStats } from '../components/section1.stats.js';

export async function loadMechanicsPage() {
    try {
        await createQuiz();
    } catch (err) {
        console.error("Error cargando la sección 1:", err);
    }
}