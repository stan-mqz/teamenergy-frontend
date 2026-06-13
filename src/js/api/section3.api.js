// src/js/api/section3.api.js

const API_BASE_URL = "http://localhost:3000/api/section3";

/**
 * Obtiene las preguntas del Tema 3 (Energía Térmica)
 */
export const fetchQuestions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/questions`);

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
    const response = await fetch(`${API_BASE_URL}/validate`, {
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
    const response = await fetch(`${API_BASE_URL}/stats`);
    if (!response.ok) throw new Error("Error al obtener estadísticas");
    return await response.json();
  } catch (error) {
    console.error("API Error (fetchStats):", error);
    throw error;
  }
};
