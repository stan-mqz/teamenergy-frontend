import { createQuiz } from "../components/section2.quiz.js";

export async function loadElectricPage() {

    const app =
        document.querySelector("#app");

    app.innerHTML = `

        <section class="hero">

            <div class="hero-inner">

                <span class="hero-badge">
                    ⚡ Ciencias · 2do Grado ⚡
                </span>

                <h1 class="hero-title">
                    Energía Eléctrica
                </h1>

                <p class="hero-subtitle">
                    La energía eléctrica permite
                    que muchos aparatos funcionen
                    en nuestra vida diaria.
                </p>

            </div>

        </section>

        <section class="planet-section">

            <div class="planet-text">

                <h2>
                    💡 ¿Qué es la energía eléctrica?
                </h2>

                <p>
                    Es una forma de energía que
                    permite que funcionen lámparas,
                    televisores y refrigeradoras.
                </p>

            </div>

        </section>

        <section class="planet-section">

            <div class="planet-text">

                <h2>
                     Fuentes de enrgía eléctrica
                </h2>

                <p>
                    En la casa, la escuela,
                    hospitales y muchos otros
                    lugares.
                </p>

            </div>

        </section>

        <section class="planet-section">

            <div class="planet-text">

                <h2>
                    ⚠️ Importancia
                </h2>

                <p>
                    Gracias a la energía eléctrica
                    podemos iluminar espacios y
                    utilizar dispositivos.
                </p>

            </div>

        </section>

    `;

    const quiz =
        await createQuiz();

    app.appendChild(quiz);
}