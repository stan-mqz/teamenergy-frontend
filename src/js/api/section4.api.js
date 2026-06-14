const API_URL = "http://localhost:3000";

export async function getSections() {

    const response =
        await fetch(
            `${API_URL}/api/section4`
        );

    return await response.json();
}

export async function getQuestions() {

    const response =
        await fetch(
            `${API_URL}/api/section4/questions`
        );

    return await response.json();
}

export async function validateAnswers(
    answers
) {

    const response =
        await fetch(
            `${API_URL}/api/section4/validate`,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json"
                },
                body: JSON.stringify({
                    answers
                })
            }
        );

    return await response.json();
}

export async function getStats() {
    const response = await fetch(`${API_URL}/api/section4/stats`);
    return await response.json();
}