import { getQuestions, validateAnswers } from "../api/section5.api";

export async function createQuiz() {
    const section = document.createElement("section");
    section.className = "quiz-section";

    const response = await getQuestions();

    if (!response.ok) {
        section.innerHTML = `
            <div class="quiz-error">
                No se pudieron cargar las preguntas.
            </div>
        `;
        return section;
    }

    const questions = response.data;

    let current = 0;
    let score = 0;

    renderQuestion();

    function renderQuestion() {
        const q = questions[current];

        section.innerHTML = `
            <div class="quiz-card">
                <h2 class="quiz-title">
                    🧠 Pon a prueba lo aprendido
                </h2>

                <div class="quiz-progress">
                    Pregunta ${current + 1} de ${questions.length}
                </div>

                <p class="quiz-question">
                    ${q.question}
                </p>

                <div class="quiz-options">
                    <button class="quiz-option" data-value="a">
                        ${q.option_a}
                    </button>

                    <button class="quiz-option" data-value="b">
                        ${q.option_b}
                    </button>

                    <button class="quiz-option" data-value="c">
                        ${q.option_c}
                    </button>
                </div>

                <button class="quiz-submit" disabled>
                    Responder
                </button>
            </div>
        `;

        let selected = null;

        const options =
            section.querySelectorAll(".quiz-option");

        const submit =
            section.querySelector(".quiz-submit");

        options.forEach(btn => {
            btn.addEventListener("click", () => {
                options.forEach(o =>
                    o.classList.remove("selected")
                );

                btn.classList.add("selected");

                selected = q[`option_${btn.dataset.value}`];

                submit.disabled = false;
            });
        });

        submit.addEventListener("click", async () => {

            const result =
                await validateAnswers([
                    {
                        questionId: q.id,
                        answer: selected
                    }
                ]);

            const answerResult =
                result.results?.[0];

            const correct =
                answerResult?.correct;

            const correctAnswer =
                answerResult?.correctAnswer;

            options.forEach(btn => {

                btn.disabled = true;

                const optionText = q[`option_${btn.dataset.value}`];

                if (optionText === correctAnswer) {
                    btn.classList.add("correct");
                }

                if (
                    !correct &&
                    optionText === selected &&
                    optionText !== correctAnswer
                ) {
                    btn.classList.add("incorrect");
                }
            });

            console.log({
                selected,
                correct,
                correctAnswer
            });


            if (correct) score++;

            submit.remove();

            const next =
                document.createElement("button");

            next.className = "quiz-next";

            next.textContent =
                current === questions.length - 1
                    ? "Ver resultado"
                    : "Siguiente";

            section
                .querySelector(".quiz-card")
                .appendChild(next);

            next.addEventListener("click", () => {

                current++;

                if (
                    current >= questions.length
                ) {
                    renderResult();
                } else {
                    renderQuestion();
                }
            });
        });
    }

    function renderResult() {
        section.innerHTML = `
            <div class="quiz-card">
                <h2 class="quiz-title">
                    🎉 ¡Terminaste!
                </h2>

                <div class="quiz-score">
                    ${score} / ${questions.length}
                </div>

                <p class="quiz-message">
                    ${score === questions.length
                ? "¡Excelente trabajo!"
                : "¡Sigue practicando!"
            }
                </p>
            </div>
        `;
    }

    return section;
}