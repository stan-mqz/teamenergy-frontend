import { createQuiz } from '../components/section1.quiz.js';
import { createStats } from '../components/section1.stats.js';
import { createLessonNavigation } from '../components/lesson.navigation.js';
import '../../css/lesson.navigation.css';


export async function loadMechanicsPage() {
    try {
        await createQuiz();
        await createStats();
        app.appendChild(createLessonNavigation(1));
    } catch (err) {
        console.error("Error cargando la sección 1:", err);
    }
}