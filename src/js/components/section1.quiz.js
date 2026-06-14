import { getQuestions, validateAnswers } from "../api/section1.api.js";

// Variables globales para controlar el estado del juego
let questions = [];
let currentQuestionIndex = 0;
let selectedOptionIndex = null;
let userAnswers = [];
let gameStarted = false; // Controla si ya se pasó la pantalla de introducción

/**
 * Inicializa el componente del Quiz de Mecánica.
 */
export async function createQuiz() {
    try {
        // 1. Cargar las preguntas desde la API local del frontend
        questions = await getQuestions();
        if (!questions || questions.length === 0) return;

        // 2. Configurar el evento del botón "Comenzar" y el botón de validación inicial
        setupQuizEvents();
        
        // 3. Mostrar la introducción teórica de "¿Qué es la Mecánica?" en el panel derecho
        renderIntroduction();

    } catch (error) {
        console.error("Error al inicializar el juego:", error);
    }
}

/**
 * Muestra la explicación interactiva adaptada para niños de 2do Grado
 */
function renderIntroduction() {
    const quizPanel = document.querySelector(".section1-quiz-panel");
    if (quizPanel) {
        quizPanel.innerHTML = `
            <div style="padding: 25px; color: white; display: flex; flex-direction: column; height: 100%; justify-content: center; font-family: 'Nunito', sans-serif;">
                <h2 style="font-size: 1.8rem; margin-bottom: 15px; color: #5ce1e6; text-align: center; font-weight: 800;">¿Qué aprendimos hoy? 📖</h2>
                
                <p style="font-size: 1.1rem; line-height: 1.5; margin-bottom: 15px; text-align: justify;">
                    ¡La <strong>Energía Mecánica</strong> está en todos lados! Es la que nos permite saltar, correr y jugar en nuestro entorno.
                </p>

                <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1); font-size: 1rem;">
                    🎈 <strong style="color: #5ce1e6;">Energía Potencial:</strong> Es la energía que está <strong>guardada</strong>. Por ejemplo, una esfera de plastilina sostenida en tu mano antes de caer.<br><br>
                    🏃‍♂️ <strong style="color: #2cd46e;">Energía Cinética:</strong> Es la energía del <strong>movimiento</strong>. ¡Aparece cuando dejas caer la plastilina al agua o cuando te deslizas por un tobogán!
                </div>

                <p style="font-size: 0.95rem; color: #ffd700; margin-bottom: 20px; text-align: center; font-weight: bold; background: rgba(255,215,0,0.1); padding: 8px; border-radius: 6px;">
                    ⭐ ¡Dato curioso! La energía se mide en una unidad llamada <strong>joule</strong> y se escribe con una <strong>J</strong>.
                </p>

                <button id="entendido-btn" style="background: #2cd46e; color: #272c44; border: none; padding: 14px; border-radius: 8px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(44, 212, 110, 0.3);">
                    ¡Iniciar el Juego de la Ciencia! 🚀
                </button>
            </div>
        `;

        document.getElementById("entendido-btn")?.addEventListener("click", () => {
            gameStarted = true;
            renderQuestion();
        });
    }
}

/**
 * Renderiza la pregunta actual con sus opciones y barra de progreso
 */
function renderQuestion() {
    if (currentQuestionIndex >= questions.length) {
        // Si no quedan preguntas, finaliza el juego y manda los resultados
        finishGame();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    selectedOptionIndex = null; // Reseteamos la opción seleccionada para la nueva pregunta

    const quizPanel = document.querySelector(".section1-quiz-panel");
    
    // Si venimos de la introducción, re-inyectamos la estructura original del juego en el panel
    if (gameStarted && currentQuestionIndex === 0) {
        quizPanel.innerHTML = `
            <div class="section1-progress-box">
              <div class="section1-progress-info">
                <span>Pregunta 1 de 2</span>
                <span class="meta-text">2 puntos posible, Animazion: mechanics</span>
              </div>
              <div class="section1-bar-bg">
                <div class="section1-bar-fill"></div>
              </div>
            </div>
            <h3 class="section1-question-text"></h3>
            <div class="section1-options-list"></div>
            <button class="btn-section1-validate" id="validate-btn">Validar respuestas</button>
        `;
        setupValidateButton(); // Re-enganchamos el evento del botón de validación
    }

    // Insertar el texto de la pregunta actual
    const questionTextEl = document.querySelector(".section1-question-text");
    if (questionTextEl) questionTextEl.textContent = currentQuestion.question;

    // Actualizar el contador de progreso ("Pregunta X de Y")
    const progressInfoEl = document.querySelector(".section1-progress-info span:first-child");
    if (progressInfoEl) progressInfoEl.textContent = `Pregunta ${currentQuestionIndex + 1} de ${questions.length}`;

    // Actualizar dinámicamente la barra verde de progreso
    const barFillEl = document.querySelector(".section1-bar-fill");
    if (barFillEl) {
        const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
        barFillEl.style.width = `${progressPercentage}%`;
    }

    // Renderizar e iluminar la lista de opciones
    const optionsListEl = document.querySelector(".section1-options-list");
    if (optionsListEl) {
        optionsListEl.innerHTML = ""; // Limpiar opciones anteriores

        currentQuestion.options.forEach((option, index) => {
            const optionItem = document.createElement("div");
            optionItem.className = "section1-option-item";
            optionItem.textContent = option;

            // Escuchador de clics para seleccionar la opción con borde brillante
            optionItem.addEventListener("click", () => {
                document.querySelectorAll(".section1-option-item").forEach(el => {
                    el.classList.remove("selected");
                    el.style.border = "none";
                    el.style.background = "";
                });
                optionItem.classList.add("selected");
                optionItem.style.border = "2px solid #5ce1e6";
                optionItem.style.background = "rgba(92, 225, 230, 0.1)";
                selectedOptionIndex = index;
            });

            optionsListEl.appendChild(optionItem);
        });
    }
}

/**
 * Configura los clicks iniciales de la vista
 */
function setupQuizEvents() {
    // Escucha el botón "Comenzar" de la izquierda para resetear o ir a la teoría
    const startBtn = document.getElementById("comenzar-btn");
    if (startBtn) {
        startBtn.addEventListener("click", () => {
            currentQuestionIndex = 0;
            gameStarted = false;
            userAnswers = [];
            renderIntroduction();
        });
    }
    setupValidateButton();
}

/**
 * Configura de forma segura el botón "Validar respuestas" para evitar duplicación de clicks
 */
function setupValidateButton() {
    const validateBtn = document.getElementById("validate-btn");
    if (validateBtn) {
        const newValidateBtn = validateBtn.cloneNode(true);
        validateBtn.replaceWith(newValidateBtn);

        newValidateBtn.addEventListener("click", async () => {
            if (selectedOptionIndex === null) {
                alert("Por favor, selecciona una opción antes de continuar.");
                return;
            }

            // Guardamos la respuesta del alumno
            const currentQuestion = questions[currentQuestionIndex];
            userAnswers.push({
                questionId: currentQuestion.id,
                selectedIndex: selectedOptionIndex
            });

            // Pasamos a la siguiente pregunta
            currentQuestionIndex++;
            renderQuestion();
        });
    }
}

/**
 * Finaliza la partida, solicita el nombre y renderiza la tarjeta final con los puntajes obtenidos
 */
async function finishGame() {
    const quizPanel = document.querySelector(".section1-quiz-panel");
    if (quizPanel) {
        quizPanel.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: white; font-family: 'Nunito', sans-serif;">
                <h2 style="font-size: 2rem; margin-bottom: 20px; color: #5ce1e6; font-weight: 800;">¡Evaluación Finalizada!</h2>
                <p style="font-size: 1.2rem; margin-bottom: 30px;">Calculando tus resultados finales con el servidor...</p>
            </div>
        `;

        // Pedir nombre mediante prompt integrado
        const nombreAlumno = prompt("Ingresa tu nombre para registrar tu puntaje:") || "Estudiante";
        
        // --- AQUÍ ESTÁ LA CORRECCIÓN ---
        // Enviamos el objeto con la estructura que el Backend necesita
        const result = await validateAnswers({
            student_name: nombreAlumno,
            answers: userAnswers,
            topic: "mechanics" 
        });

        // Renderizar tarjeta estética
        quizPanel.innerHTML = `
            <div style="padding: 30px; color: white; display: flex; flex-direction: column; height: 100%; justify-content: center; font-family: 'Nunito', sans-serif;">
                <h2 style="font-size: 1.8rem; margin-bottom: 15px; color: #5ce1e6; text-align: center; font-weight: 800;">Resultados de ${nombreAlumno}</h2>
                
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 1.1rem;">
                        <span>Preguntas Correctas:</span>
                        <strong style="color: #2cd46e;">${result.correct_answers} de ${questions.length}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 1.1rem;">
                        <span>Puntaje Final:</span>
                        <strong style="color: #ffd700;">${result.total_score} / 100 pts</strong>
                    </div>
                </div>

                <button id="reiniciar-btn" style="background: #5ce1e6; color: #272c44; border: none; padding: 14px; border-radius: 8px; font-weight: bold; font-size: 1.1rem; cursor: pointer; transition: transform 0.2s;">
                    Volver a Jugar 🔄
                </button>
            </div>
        `;

        document.getElementById("reiniciar-btn")?.addEventListener("click", () => {
            window.location.reload();
        });
    }
}