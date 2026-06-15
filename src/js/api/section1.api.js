import { API_URL } from "../config.js";

export async function getSections() {
    const response = await fetch(`${API_URL}/api/section1`);
    return await response.json();
}

export async function getQuestions() {
    const response = await fetch(`${API_URL}/api/section1/questions`);
    return await response.json();
}

export async function validateAnswers(student_name, answers) {
    const response = await fetch(`${API_URL}/api/section1/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_name, answers })
    });
    return await response.json();
}

export async function getStats() {
    const response = await fetch(`${API_URL}/api/section1/stats`);
    return await response.json();
}