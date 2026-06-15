import { getQuestions, validateAnswers } from "../api/section1.api.js";

export async function createQuiz() {
    // Agarramos los elementos que YA existen en el HTML
    const startBtn    = document.getElementById("comenzar-btn");
    const quizPanel   = document.querySelector(".section1-quiz-panel");
    const progressBox = document.querySelector(".section1-progress-box");

    // Cargamos preguntas desde el backend
    const raw = await getQuestions();
    const questions = Array.isArray(raw) ? raw : (raw.data ?? []);

    if (!questions.length) {
        quizPanel.innerHTML = `<p style="color:#FF6B6B; padding:20px;">No se pudieron cargar las preguntas.</p>`;
        return;
    }

    let current = 0;
    let score   = 0;
    let studentName = "";

    // Click en "Comenzar" → pedir nombre y arrancar
    startBtn.addEventListener("click", () => {
        studentName = prompt("Ingresa tu nombre para registrar tu puntaje:") || "Estudiante";
        renderQuestion();
    });

    function renderQuestion() {
        const q = questions[current];

        // Actualizar barra de progreso
        const pct = ((current + 1) / questions.length) * 100;
        progressBox.innerHTML = `
            <div class="section1-progress-info">
                <span>Pregunta ${current + 1} de ${questions.length}</span>
                <span class="meta-text">${studentName}</span>
            </div>
            <div class="section1-bar-bg">
                <div class="section1-bar-fill" style="width: ${pct}%"></div>
            </div>
        `;

        // Renderizar pregunta y opciones en el panel derecho
        quizPanel.innerHTML = `
            ${progressBox.outerHTML}
            <h3 class="section1-question-text">${q.question}</h3>
            <div class="section1-options-list">
                ${q.options.map((opt, i) => `
                    <div class="section1-option-item" data-index="${i}">${opt}</div>
                `).join('')}
            </div>
            <button class="btn-section1-validate" id="validate-btn" disabled>
                Validar respuesta
            </button>
        `;

        let selectedIndex = null;
        const optionEls  = quizPanel.querySelectorAll(".section1-option-item");
        const validateBtn = quizPanel.querySelector("#validate-btn");

        optionEls.forEach(el => {
            el.addEventListener("click", () => {
                optionEls.forEach(o => {
                    o.classList.remove("selected");
                    o.style.border = "";
                    o.style.background = "";
                });
                el.classList.add("selected");
                selectedIndex = Number(el.dataset.index);
                validateBtn.disabled = false;
            });
        });

        validateBtn.addEventListener("click", async () => {
            validateBtn.disabled = true;

            // Enviamos al backend para guardar en BD
            await validateAnswers(
                studentName,
                [{ questionId: q.id, selectedIndex }]
            );

            // Feedback visual
            const wasCorrect = selectedIndex === q.answerIndex;
            if (wasCorrect) score++;

            optionEls.forEach(el => {
                const idx = Number(el.dataset.index);
                if (idx === q.answerIndex)  el.classList.add("correct");
                if (!wasCorrect && idx === selectedIndex) el.classList.add("incorrect");
            });

            // Cambiar botón a "Siguiente"
            validateBtn.textContent = current < questions.length - 1
                ? "Siguiente →"
                : "Ver resultado";
            validateBtn.disabled = false;

            validateBtn.replaceWith(validateBtn.cloneNode(true)); // limpiar listener
            const nextBtn = quizPanel.querySelector("#validate-btn");

            nextBtn.addEventListener("click", () => {
                current++;
                if (current >= questions.length) {
                    renderResult();
                } else {
                    renderQuestion();
                }
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
                        : score >= questions.length / 2
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