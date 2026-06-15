import { API_URL } from "../config.js";

/**
 * Obtiene las preguntas del Tema 3 (Energía Térmica)
 */
export const fetchQuestions = async () => {
  try {
    const response = await fetch(`${API_URL}/api/section3/questions`);

    if (!response.ok) throw new Error("Error al obtener preguntas");
    return await response.json();
  } catch (error) {
    console.log(error)
    console.error("API Error (fetchQuestions):", error);
    throw error;
  }
};

/**
 * Envía las respuestas al backend para su validación segura
 * @param {Array} answers - [{ questionId: string, answer: string }]
 */
export const validateAnswers = async (answers) => {
  try {
    const response = await fetch(`${API_URL}/api/section3/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answers }),
    });
    if (!response.ok) throw new Error("Error al validar respuestas");
    return await response.json();
  } catch (error) {
    console.log(error)
    console.error("API Error (validateAnswers):", error);
    throw error;
  }
};

/**
 * Obtiene las estadísticas acumuladas de las preguntas del Tema 3
 */
export const fetchStats = async () => {
  try {
    const response = await fetch(`${API_URL}/api/section3/stats`);
    if (!response.ok) throw new Error("Error al obtener estadísticas");
    return await response.json();
  } catch (error) {
    console.error("API Error (fetchStats):", error);
    throw error;
  }
};
