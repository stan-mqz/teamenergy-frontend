import {
    getQuestions,
    submitResults
}
from "../api/section2.api.js";

export async function createQuiz() {

    const section =
        document.createElement("section");

    section.className =
        "quiz-section";

    const response =
        await getQuestions();

    const questions =
        response.questions;

    let answers = [];

    renderQuestion(0);

    function renderQuestion(index) {

        const q =
            questions[index];

        section.innerHTML = `

            <div class="quiz-card">

                <h2 class="quiz-title">
                    🧠 Quiz de Energía Eléctrica
                </h2>

                <div class="quiz-progress">
                    Pregunta ${index + 1}
                    de ${questions.length}
                </div>

                <p class="quiz-question">
                    ${q.question}
                </p>

                <div class="quiz-options">

                    ${q.options.map(
                        (option, i) => `
                            <button
                                class="quiz-option"
                                data-value="${i}">
                                ${option}
                            </button>
                        `
                    ).join("")}

                </div>

                <button
                    class="quiz-submit"
                    disabled>

                    Continuar

                </button>

            </div>
        `;

        let selected = null;

        const options =
            section.querySelectorAll(
                ".quiz-option"
            );

        const submit =
            section.querySelector(
                ".quiz-submit"
            );

        options.forEach(btn => {

            btn.addEventListener(
                "click",
                () => {

                    options.forEach(o =>
                        o.classList.remove(
                            "selected"
                        )
                    );

                    btn.classList.add(
                        "selected"
                    );

                    selected =
                        Number(
                            btn.dataset.value
                        );

                    submit.disabled =
                        false;
                }
            );

        });

        submit.addEventListener(
            "click",
            () => {

                answers.push({
                    questionId: q.id,
                    selectedIndex: selected
                });

                if (
                    index + 1 <
                    questions.length
                ) {
                    renderQuestion(
                        index + 1
                    );
                }
                else {
                    showResult();
                }
            }
        );
    }

    async function showResult() {

        const student_name =
            prompt(
                "Ingresa tu nombre"
            ) || "Estudiante";

        const result =
            await submitResults(
                student_name,
                answers
            );

        section.innerHTML = `

            <div class="quiz-card">

                <h2 class="quiz-title">
                    🎉 ¡Terminaste!
                </h2>

                <div class="quiz-score">
                    ${result.total_score}/100
                </div>

                <p class="quiz-message">
                    Respuestas correctas:
                    ${result.correct_answers}
                </p>

            </div>

        `;
    }

    return section;
}