/* ═══════════════════════════════════════════════
   SECTION 1: API CONTROLLER — "Mecánica para Niños 🎈"
   ═══════════════════════════════════════════════ */

const API_URL = "http://localhost:3000";

// 🚀 Obtener secciones desde backend
export async function getSections() {
    try {
        const res = await fetch(`${API_URL}/api/section1/sections`);
        return await res.json();
    } catch (error) {
        console.error("Error cargando secciones:", error);
        return [];
    }
}

// 📋 Obtener preguntas desde la BASE DE DATOS
export async function getQuestions() {
    try {
        const res = await fetch(`${API_URL}/api/section1/questions`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error cargando preguntas:", error);
        return [];
    }
}

// 💾 Enviar respuestas al backend (VALIDACIÓN REAL)
export async function validateAnswers(student_name, answers) {
    try {
        const res = await fetch(`${API_URL}/api/section1/results`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                student_name: student_name,
                answers: answers,
                topic: "mechanics" 
            })
        });

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Error enviando respuestas:", error);
        return {
            student_name,
            correct_answers: 0,
            total_score: 0
        };
    }
}
// 📊 Obtener leaderboard real desde backend
export async function getStats() {
    try {
        const res = await fetch(`${API_URL}/api/section1/leaderboard`);
        return await res.json();
    } catch (error) {
        console.error("Error cargando estadísticas:", error);
        return [];
    }
}