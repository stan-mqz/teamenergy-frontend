import { getQuestions, validateAnswers } from "../api/section1.api.js";

export async function createQuiz() {
    const startBtn  = document.getElementById("comenzar-btn");
    const quizPanel = document.querySelector(".section1-quiz-panel");
    const progressBox = document.querySelector(".section1-progress-box");

    const raw = await getQuestions();
    const questions = Array.isArray(raw) ? raw : (raw.data ?? []);

    if (!questions.length) {
        quizPanel.innerHTML = `<p style="color:#FF6B6B; padding:20px;">No se pudieron cargar las preguntas.</p>`;
        return;
    }

    let current = 0;
    let score   = 0;

    startBtn.addEventListener("click", () => {
        renderQuestion();
    });

    function renderQuestion() {
        const q   = questions[current];
        const pct = ((current + 1) / questions.length) * 100;

        quizPanel.innerHTML = `
            <div class="section1-progress-box">
                <div class="section1-progress-info">
                    <span>Pregunta ${current + 1} de ${questions.length}</span>
                </div>
                <div class="section1-bar-bg">
                    <div class="section1-bar-fill" style="width: ${pct}%"></div>
                </div>
            </div>

            <h3 class="section1-question-text">${q.question}</h3>

            <div class="section1-options-list">
                ${q.options.map((opt, i) => `
                    <div class="section1-option-item" data-index="${i}">${opt}</div>
                `).join('')}
            </div>
        `;

        const optionEls = quizPanel.querySelectorAll(".section1-option-item");

        optionEls.forEach(el => {
            el.addEventListener("click", async () => {
                // Evitar doble click
                optionEls.forEach(o => o.style.pointerEvents = "none");

                const selectedIndex = Number(el.dataset.index);

                // Feedback visual inmediato
                const wasCorrect = selectedIndex === q.answerIndex;
                if (wasCorrect) score++;

                optionEls.forEach(o => {
                    const idx = Number(o.dataset.index);
                    if (idx === q.answerIndex)                 o.classList.add("section1-option-item--correct");
                    if (!wasCorrect && idx === selectedIndex)  o.classList.add("section1-option-item--incorrect");
                });

                // Enviar al backend en segundo plano
                validateAnswers(
                    "Anónimo",
                    [{ questionId: q.id, selectedIndex }]
                ).catch(err => console.error("Error al validar:", err));

                // Botón siguiente aparece debajo
                const nextBtn = document.createElement("button");
                nextBtn.className = "btn-section1-validate";
                nextBtn.textContent = current < questions.length - 1
                    ? "Siguiente →"
                    : "Ver resultado";

                quizPanel.appendChild(nextBtn);

                nextBtn.addEventListener("click", () => {
                    current++;
                    if (current >= questions.length) renderResult();
                    else renderQuestion();
                });
            });
        });
    }

    function renderResult() {
        quizPanel.innerHTML = `
            <div style="
                display: flex; flex-direction: column; align-items: center;
                justify-content: center; height: 100%; gap: 20px;
                padding: 30px; text-align: center;
            ">
                <h2 style="font-size: 1.8rem; color: #5ce1e6; font-weight: 800;">
                    🎉 ¡Terminaste!
                </h2>
                <div class="section1-question-text" style="font-size: 3.5rem; color: #ffd700;">
                    ${score} / ${questions.length}
                </div>
                <p style="color: #a0a5c1; font-size: 1.1rem;">
                    ${score === questions.length
                        ? "¡Excelente! ¡Respuestas perfectas! 🌟"
                        : score >= Math.ceil(questions.length / 2)
                            ? "¡Muy bien! Sigue practicando. 💪"
                            : "¡Ánimo! Puedes volver a intentarlo. 🔄"}
                </p>
                <button class="btn-section1-validate" onclick="location.reload()">
                    Volver a jugar 🔄
                </button>
            </div>
        `;
    }
}