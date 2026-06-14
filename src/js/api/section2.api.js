const API_URL = "http://localhost:3000";

export async function getQuestions() {

    const response = await fetch(
        `${API_URL}/api/section2/questions`
    );

    return await response.json();
}

export async function submitResults(
    student_name,
    answers
) {

    const response = await fetch(
        `${API_URL}/api/section2/submit`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                student_name,
                answers
            })
        }
    );

    return await response.json();
}

export async function getLeaderboard() {

    const response = await fetch(
        `${API_URL}/api/section2/leaderboard`
    );

    return await response.json();
}