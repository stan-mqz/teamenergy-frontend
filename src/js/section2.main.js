import {
    getQuestions,
    submitResults
} from "./api/section2.api.js";

const app = document.getElementById("app");

let answers = [];
let correctCount = 0;

const correctAnswersMap = {
    201: 1,
    202: 2,
    203: 1,
    204: 0,
    205: 0
};



function foquitoHabla(texto) {
    const box = document.getElementById("foquito-text");
    if (box) {
        box.textContent = texto;
    }
}

async function init() {

    const data = await getQuestions();

    renderGame(data);
}



function renderGame(data) {

    app.innerHTML = `

        <div id="battery-fixed">

            Energía de la ciudad

            <div id="battery-bar">
                █░░░░░
            </div>

        </div>

        <div class="hero">

            <div class="hero-image-container">
                <img
                    // src="/img/foquito.png"
                    alt="Foquito"
                    class="hero-image"
                >
            </div>

            <h1> MISIÓN: ENCENDER LA CIUDAD </h1>

            <p>
                Cada respuesta correcta llenará
                la energía de la ciudad.
            </p>

        </div>

        <div class="character-box">

    <img
    src="/img/foquito.png"
    alt="Foquito"
    class="character"
>
    <div class="speech-bubble" id="foquito-text">
        ¡Hola! Soy Foquito y te ayudaré a aprender sobre energía.
    </div>

</div>

        

        <!-- EXPLICACIÓN INTERACTIVA -->

        <div class="info-card interactive">

            <div class="info-header">
                <img src="/img/electricity.png" class="info-img">
                <h2>¿Qué es la energía eléctrica?</h2>
            </div>

            <p>Es la energía que viaja por cables y hace que los dispositivos funcionen. </p>


            <div class="examples">
               <div class="examples">

    <span data-sound data-info="El televisor necesita energía eléctrica para funcionar ⚡">
        <img src="/img/tv.png" class="info-img">
        Televisor
    </span>

    <span data-sound data-info="El árbol NO necesita energía eléctrica 🌳">
        <img src="/img/arbol.png" class="info-img">
        Árbol
    </span>

    <span data-sound data-info="La refrigeradora necesita electricidad para enfriar 🧊">
        <img src="/img/refri.png" class="info-img">
        Refrigeradora
    </span>



</div>

            </div>

        </div>

        <div class="info-card interactive">


        
            <div class="info-header">
                <img src="/img/energía.png" class="info-img">
                <h2>Fuentes de energía eléctrica</h2>
            </div>

            <div class="examples">

            <span data-sound data-info="Usa la fuerza del agua para generar electricidad 💧">
            <img src="/img/rio.png" class="info-img">
             Hidráulica
            </span>

            <span data-sound data-info="La batería es una fuente artificial creada por el ser humano 🔋">
            <img src="/img/bateria.png" class="info-img">
             Batería
            </span>

            <span data-sound data-info="El viento mueve aspas que generan energía 🌬️">
            <img src="/img/eolica.png" class="info-img">
             Eólica
            </span>

            <span data-sound data-info="La pila almacena energía y es una fuente artificial 🔋">
             <img src="/img/pila.png" class="info-img">
            Pila
            </span>

            <span data-sound data-info="El sol produce energía limpia ☀️">
            <img src="/img/solar.png" class="info-img">
            Solar
            </span>    
            
            </div>

        </div>

        <div class="info-card interactive">

            <div class="info-header">
                <img src="/img/lightbulb.png" class="info-img">
                <h2>¿Por qué es importante?</h2>
            </div>

            <div class="importance">
                <div class="bad">❌ Sin luz → todo oscuro</div>
                <div class="good">✅ Con luz → todo funciona</div>
            </div>

            <div data-sound class="mini-demo">
                <img id="bulb" src="/img/bulb-off.png">
                <br>
                <button id="lightBtn">Encender</button>
            </div>

        </div>

        <!-- INICIO -->

        <div class="city-container">
            <div id="city">
            <img src="/img/city.png" class="city-img">
            </div>
        </div>

        <div class="start-section">

            <input
                id="studentName"
                type="text"
                placeholder="Escribe tu nombre"
            />

            <button data-sound id="startBtn">
                Comenzar misión
            </button>

        </div>

        <div id="quizArea"></div>

        <div id="result"></div>
    `;

    document
        .getElementById("startBtn")
        .addEventListener(
            "click",
            () => startQuiz(data.questions)
        );

    initInteractions();

    foquitoHabla("¡Hola! Soy Foquito ⚡ Vamos a encender la ciudad 💡");


}

/* =========================
   INTERACCIONES NUEVAS
========================= */

function initInteractions() {

    const clickSound = new Audio("/sounds/click.mp3");


    document.querySelectorAll("[data-sound]")
        .forEach(el => {
            el.addEventListener("click", () => {

                // 🔊 sonido
                clickSound.currentTime = 0;
                clickSound.play();

                // 💡 explicación (si tiene)
                if (el.dataset.info) {
                    foquitoHabla(el.dataset.info);
                }

                // ✨ animación
                el.style.transform = "scale(1.2)";

                setTimeout(() => {
                    el.style.transform = "scale(1)";
                }, 200);
            });
        });

    const bulb = document.getElementById("bulb");
    const btn = document.getElementById("lightBtn");

    if (btn) {

        let bulbOn = false;

        btn.addEventListener("click", () => {

            bulbOn = !bulbOn;

            if (bulbOn) {
                bulb.src = "/img/bulb-on.png";
                btn.textContent = "Apagar";
            } else {
                bulb.src = "/img/bulb-off.png";
                btn.textContent = "Encender";
            }
        });
    }
}

/* =========================
   QUIZ
========================= */

function startQuiz(questions) {

    answers = [];

    document.querySelector(".start-section").style.display = "none";

    foquitoHabla("Ahora responde las preguntas 😄");

    showQuestion(questions, 0);
}

function showQuestion(questions, index) {

    foquitoHabla("Lee bien la pregunta 🤔");

    const q = questions[index];

    document.getElementById("quizArea").innerHTML = `

        <div class="question-card">

            <h2>
                Pregunta ${index + 1} de ${questions.length}
            </h2>

            <h3>
                ${q.question}
            </h3>

            <div class="options">

                ${q.options.map(
        (option, i) => `
                        <button
                            class="option-btn"
                            data-value="${i}">
                            ${option}
                        </button>
                    `
    ).join("")}

            </div>

        </div>
    `;

    document
        .querySelectorAll(".option-btn")
        .forEach(btn => {

            btn.addEventListener("click", () => {

            const selectSound = new Audio("/sounds/click.mp3");
            selectSound.currentTime = 0;
            selectSound.play();


                const selected = Number(btn.dataset.value);
                const correct = correctAnswersMap[q.id];

                // guardar respuesta
                answers.push({
                    questionId: q.id,
                    selectedIndex: selected
                });

                if (selected === correct) {

                    foquitoHabla("¡Muy bien! ⚡");

                    // 🟢 marcar correcta
                    btn.style.background = "#66BB6A";

                    updateBattery(index + 1);

                    setTimeout(() => {
                        if (index + 1 < questions.length) {
                            showQuestion(questions, index + 1);
                        } else {
                            finishQuiz();
                        }
                    }, 500);

                } else {

                    foquitoHabla("Oops 😅 esa no era");

                    // 🔴 marcar incorrecta
                    btn.style.background = "#EF5350";

                    // 🟢 mostrar correcta
                    document.querySelectorAll(".option-btn").forEach((b, i) => {
                        if (i === correct) {
                            b.style.background = "#66BB6A";
                        }
                    });

                    // ⏭ avanzar después de un momento
                    setTimeout(() => {
                        if (index + 1 < questions.length) {
                            showQuestion(questions, index + 1);
                        } else {
                            finishQuiz();
                        }
                    }, 800);
                }
            });



        });
}

/* =========================
   BATERÍA + CIUDAD
========================= */

function updateBattery(level) {

    const battery = document.getElementById("battery-bar");

    const states = [
        "█░░░░░",
        "██░░░░",
        "███░░░",
        "████░░",
        "█████░",
        "██████"
    ];

    battery.textContent = states[level];

    // 🔥 ciudad cambia

    const cityImg = document.querySelector(".city-img");

    // brillo progresivo
    const brightnessLevels = [0.3, 0.5, 0.7, 0.9, 1.1, 1.3];

    cityImg.style.filter = `
    brightness(${brightnessLevels[level]})
    drop-shadow(0 0 ${level * 5}px rgba(255,235,59,0.6))
`;

    // 💥 CAMBIO FINAL DE IMAGEN


    if (level === 5) {

        cityImg.style.transform = "scale(1.1)";

        setTimeout(() => {
            cityImg.src = "img/city-final.png";
        }, 200);
    }




}

/* =========================
   RESULTADO FINAL
========================= */

async function finishQuiz() {

    const student_name =
        document.getElementById("studentName").value || "Estudiante";

    const result =
        await submitResults(student_name, answers);

    document.getElementById("quizArea").innerHTML = "";

    document.getElementById("result").innerHTML = `

        <div class="result-card">

            <h2>¡MISIÓN COMPLETADA!</h2>

            <h3>${student_name}</h3>

            <p>Correctas: ${result.correct_answers ?? 0}</p>

            <p>Puntaje: ${result.total_score ?? 0}</p>

            <div class="trophy">🏆</div>

            

        </div>
    `;

    const correct = result.correct_answers ?? 0;

    if (correct === 5) {
        foquitoHabla("¡Increíble! ⚡ Encendiste toda la ciudad ");
    } else if (correct >= 3) {
        foquitoHabla("¡Vas muy bien!  La ciudad está parcialmente encendida 💡");
    } else {
        foquitoHabla("Hmm 😅 la ciudad sigue oscura... intenta de nuevo 💡");
    }



}



init();