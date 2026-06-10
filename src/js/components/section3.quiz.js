// src/js/components/section3.quiz.js
import { validateAnswers } from '../api/section3.api.js';

export const renderQuiz = (container, questions, onQuizComplete) => {
    const limitedQuestions = questions.slice(0, 3);
    let selectedAnswers = {};

    container.innerHTML = `
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');

            .edu-wrap * { box-sizing: border-box; }

            /* ── Scroll Reveal ── */
            .reveal {
                opacity: 0;
                transform: translateY(60px);
                transition: opacity 0.8s cubic-bezier(.22,1,.36,1), transform 0.8s cubic-bezier(.22,1,.36,1);
            }
            .reveal.visible { opacity: 1; transform: translateY(0); }
            .reveal-left  { opacity: 0; transform: translateX(-70px); transition: opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1); }
            .reveal-left.visible  { opacity: 1; transform: translateX(0); }
            .reveal-right { opacity: 0; transform: translateX(70px);  transition: opacity 0.9s cubic-bezier(.22,1,.36,1), transform 0.9s cubic-bezier(.22,1,.36,1); }
            .reveal-right.visible { opacity: 1; transform: translateX(0); }
            .delay-1 { transition-delay: 0.1s; }
            .delay-2 { transition-delay: 0.22s; }
            .delay-3 { transition-delay: 0.34s; }
            .delay-4 { transition-delay: 0.46s; }

            /* ── Float animations ── */
            @keyframes floatA { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-18px) rotate(3deg)} }
            @keyframes floatB { 0%,100%{transform:translateY(0) rotate(5deg)}  50%{transform:translateY(-24px) rotate(-5deg)} }
            @keyframes floatC { 0%,100%{transform:translateY(0)}               50%{transform:translateY(-14px)} }
            @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            @keyframes spinSlow{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
            @keyframes pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
            @keyframes blobMove{ 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%; transform:rotate(0deg)}
                                  25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}
                                  50%{border-radius:50% 60% 30% 60%/30% 40% 70% 60%; transform:rotate(180deg)}
                                  75%{border-radius:60% 40% 60% 30%/60% 30% 40% 70%} }
            @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
            @keyframes wiggle  { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-8deg)} 75%{transform:rotate(8deg)} }
            @keyframes bounce  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
            @keyframes starPop { 0%{opacity:0;transform:scale(0) rotate(-30deg)} 60%{transform:scale(1.3) rotate(10deg)} 100%{opacity:1;transform:scale(1) rotate(0deg)} }

            /* ── Hero ── */
            .edu-hero {
                position: relative;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                padding: 6rem 0 8rem;
                overflow: hidden;
            }
            .edu-hero-blob {
                position: absolute;
                border-radius: 60% 40% 30% 70%/60% 30% 70% 40%;
                animation: blobMove 12s ease-in-out infinite;
                filter: blur(60px);
                pointer-events: none;
                z-index: 0;
            }
            .edu-hero-label {
                font-family: 'Nunito', sans-serif;
                font-weight: 900;
                font-size: 0.85rem;
                letter-spacing: 4px;
                text-transform: uppercase;
                color: var(--accent-orange, #ff7a00);
                margin-bottom: 1.5rem;
                position: relative; z-index: 1;
            }
            .edu-hero-title {
                font-family: 'Fredoka One', cursive;
                font-size: clamp(3rem, 7vw, 6rem);
                font-weight: 400;
                line-height: 1.1;
                margin: 0 0 2rem;
                background: linear-gradient(135deg, #fff 40%, rgba(255,122,0,0.8));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                position: relative; z-index: 1;
                max-width: 780px;
            }
            .edu-hero-sub {
                font-family: 'Nunito', sans-serif;
                font-size: clamp(1.1rem, 2vw, 1.35rem);
                line-height: 1.7;
                opacity: 0.65;
                max-width: 580px;
                position: relative; z-index: 1;
            }
            .edu-hero-floater {
                position: absolute;
                right: 3%;
                top: 50%;
                transform: translateY(-50%);
                font-size: clamp(5rem, 12vw, 11rem);
                user-select: none;
                animation: floatA 5s ease-in-out infinite;
                z-index: 1;
                filter: drop-shadow(0 0 40px rgba(255,122,0,0.3));
            }

            /* ── Full-width section card ── */
            .edu-section {
                width: 100%;
                border-radius: 36px;
                padding: 5rem 4rem;
                margin-bottom: 3rem;
                position: relative;
                overflow: hidden;
                text-align: left;
            }
            .edu-section-icon {
                font-size: 4rem;
                margin-bottom: 1.5rem;
                display: block;
                animation: floatC 4s ease-in-out infinite;
            }
            .edu-section-tag {
                font-family: 'Nunito', sans-serif;
                font-size: 0.78rem;
                font-weight: 800;
                letter-spacing: 3px;
                text-transform: uppercase;
                margin-bottom: 0.75rem;
                display: block;
            }
            .edu-section-title {
                font-family: 'Fredoka One', cursive;
                font-size: clamp(2.2rem, 4.5vw, 3.8rem);
                font-weight: 400;
                line-height: 1.15;
                margin: 0 0 1.5rem;
                color: #fff;
            }
            .edu-section-body {
                font-family: 'Nunito', sans-serif;
                font-size: clamp(1rem, 1.8vw, 1.2rem);
                line-height: 1.8;
                opacity: 0.8;
                max-width: 700px;
                margin: 0 0 1.5rem;
            }
            .edu-section-body-dim { opacity: 0.5; }

            /* ── Fun fact callout ── */
            .edu-callout {
                display: flex;
                align-items: flex-start;
                gap: 1rem;
                padding: 1.4rem 1.6rem;
                border-radius: 20px;
                font-family: 'Nunito', sans-serif;
                font-size: 1rem;
                line-height: 1.6;
                max-width: 640px;
                margin-top: 1.5rem;
            }
            .edu-callout-icon { font-size: 1.6rem; flex-shrink: 0; }

            /* ── Two-column split section ── */
            .edu-split {
                width: 100%;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                margin-bottom: 3rem;
            }
            @media(max-width: 700px){ .edu-split { grid-template-columns: 1fr; } }
            .edu-split-card {
                border-radius: 28px;
                padding: 3rem 2.5rem;
                position: relative;
                overflow: hidden;
            }
            .edu-split-big {
                font-family: 'Fredoka One', cursive;
                font-size: 5rem;
                line-height: 1;
                margin-bottom: 0.5rem;
            }
            .edu-split-label {
                font-family: 'Nunito', sans-serif;
                font-weight: 900;
                font-size: 1.3rem;
                margin-bottom: 0.75rem;
                color: #fff;
            }
            .edu-split-body {
                font-family: 'Nunito', sans-serif;
                font-size: 1rem;
                line-height: 1.7;
                opacity: 0.7;
            }

            /* ── Timeline / Steps ── */
            .edu-steps {
                width: 100%;
                border-radius: 36px;
                padding: 5rem 4rem;
                margin-bottom: 3rem;
                position: relative;
                overflow: hidden;
            }
            .edu-steps-title {
                font-family: 'Fredoka One', cursive;
                font-size: clamp(2.2rem, 4vw, 3.5rem);
                color: #fff;
                margin: 0 0 3rem;
            }
            .edu-step-row {
                display: flex;
                align-items: flex-start;
                gap: 1.5rem;
                margin-bottom: 2.5rem;
                padding-bottom: 2.5rem;
                border-bottom: 1px solid rgba(255,255,255,0.06);
            }
            .edu-step-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .edu-step-num {
                font-family: 'Fredoka One', cursive;
                font-size: 3.5rem;
                line-height: 1;
                flex-shrink: 0;
                width: 70px;
                text-align: center;
                animation: pulse 3s ease-in-out infinite;
            }
            .edu-step-content { flex: 1; }
            .edu-step-heading {
                font-family: 'Nunito', sans-serif;
                font-weight: 900;
                font-size: 1.3rem;
                color: #fff;
                margin: 0 0 0.5rem;
            }
            .edu-step-text {
                font-family: 'Nunito', sans-serif;
                font-size: 1rem;
                line-height: 1.7;
                opacity: 0.7;
                margin: 0;
            }

            /* ── Fun fact banner ── */
            .edu-banner {
                width: 100%;
                border-radius: 36px;
                padding: 4rem;
                margin-bottom: 3rem;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            .edu-banner-stars {
                position: absolute; inset: 0; pointer-events: none; overflow: hidden;
            }
            .edu-banner-star {
                position: absolute;
                font-size: 1.5rem;
                animation: starPop 0.6s ease forwards, floatB 4s ease-in-out infinite 0.6s;
                opacity: 0;
            }
            .edu-banner-emoji {
                font-size: 5rem;
                display: block;
                margin-bottom: 1.5rem;
                animation: wiggle 2.5s ease-in-out infinite;
            }
            .edu-banner-title {
                font-family: 'Fredoka One', cursive;
                font-size: clamp(2rem, 4vw, 3.2rem);
                color: #fff;
                margin: 0 0 1rem;
            }
            .edu-banner-body {
                font-family: 'Nunito', sans-serif;
                font-size: 1.15rem;
                line-height: 1.7;
                opacity: 0.8;
                max-width: 600px;
                margin: 0 auto;
            }

            /* ── Quiz card ── */
            .edu-quiz-wrap {
                width: 100%;
                border-radius: 36px;
                padding: 4rem;
                margin-bottom: 3rem;
                border: 1px solid rgba(255,255,255,0.08);
                background: rgba(255,255,255,0.025);
                backdrop-filter: blur(20px);
            }
            .edu-quiz-title {
                font-family: 'Fredoka One', cursive;
                font-size: clamp(2rem, 4vw, 3rem);
                color: #fff;
                margin: 0 0 0.5rem;
            }
            .edu-quiz-sub {
                font-family: 'Nunito', sans-serif;
                font-size: 1rem;
                opacity: 0.6;
                margin: 0 0 2.5rem;
                line-height: 1.6;
            }
            .edu-question-block { margin-bottom: 2.5rem; }
            .edu-question-text {
                font-family: 'Nunito', sans-serif;
                font-weight: 800;
                font-size: 1.1rem;
                color: #fff;
                margin: 0 0 1rem;
                line-height: 1.5;
            }
            .edu-options { display: grid; gap: 0.75rem; }
            .edu-option-btn {
                font-family: 'Nunito', sans-serif;
                font-weight: 700;
                font-size: 1rem;
                width: 100%;
                text-align: left;
                padding: 1rem 1.4rem;
                border-radius: 16px;
                border: 1.5px solid rgba(255,255,255,0.08);
                background: rgba(255,255,255,0.025);
                color: rgba(255,255,255,0.85);
                cursor: pointer;
                transition: all 0.2s ease;
            }
            .edu-option-btn:hover {
                background: rgba(255,122,0,0.08);
                border-color: rgba(255,122,0,0.4);
                transform: translateX(4px);
            }
            .edu-option-btn.selected {
                background: rgba(255,122,0,0.14);
                border-color: var(--accent-orange, #ff7a00);
                box-shadow: 0 0 20px rgba(255,122,0,0.18);
                color: #fff;
            }
            .edu-submit-btn {
                font-family: 'Fredoka One', cursive;
                font-size: 1.3rem;
                padding: 1rem 3rem;
                border-radius: 100px;
                border: none;
                background: linear-gradient(135deg, #ff7a00, #ff4d00);
                color: #fff;
                cursor: pointer;
                margin-top: 1rem;
                transition: transform 0.2s, box-shadow 0.2s;
                box-shadow: 0 8px 30px rgba(255,100,0,0.35);
            }
            .edu-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 40px rgba(255,100,0,0.45); }
            .edu-submit-btn:disabled { opacity: 0.5; transform: none; cursor: not-allowed; }

            /* ── Results ── */
            .edu-results-summary {
                padding: 2.5rem;
                border-radius: 24px;
                background: rgba(255,255,255,0.04);
                text-align: center;
                margin-bottom: 2rem;
            }
            .edu-score-num {
                font-family: 'Fredoka One', cursive;
                font-size: 4.5rem;
                color: var(--accent-orange, #ff7a00);
            }
            .edu-feedback-grid { display: grid; gap: 1rem; }
            .edu-feedback-item {
                padding: 1.4rem;
                border-radius: 18px;
                font-family: 'Nunito', sans-serif;
            }
            .edu-feedback-q { font-weight: 800; font-size: 1rem; margin: 0 0 0.5rem; color: #fff; }
            .edu-feedback-a { font-size: 0.9rem; margin: 0.2rem 0; opacity: 0.85; }
            .edu-retry-btn {
                font-family: 'Fredoka One', cursive;
                font-size: 1.2rem;
                padding: 1rem 2.5rem;
                border-radius: 100px;
                border: none;
                background: rgba(255,255,255,0.12);
                color: #fff;
                cursor: pointer;
                margin-top: 1.5rem;
                transition: background 0.2s;
            }
            .edu-retry-btn:hover { background: rgba(255,255,255,0.2); }

            /* ── Decorative particles ── */
            .deco-particle {
                position: absolute;
                pointer-events: none;
                user-select: none;
                font-size: 1.8rem;
                opacity: 0.18;
            }
        </style>

        <div class="edu-wrap">

            <!-- ══════════ HERO ══════════ -->
            <section class="edu-hero reveal">
                <div class="edu-hero-blob" style="width:420px;height:420px;background:rgba(255,122,0,0.15);top:-80px;left:-120px;animation-duration:14s;"></div>
                <div class="edu-hero-blob" style="width:280px;height:280px;background:rgba(97,255,202,0.08);bottom:60px;left:30%;animation-duration:10s;animation-delay:-5s;"></div>

                <p class="edu-hero-label reveal delay-1">Unidad 2 · Propiedades de la Materia</p>
                <h1 class="edu-hero-title reveal delay-2">El universo invisible<br>que vive dentro de todo.</h1>
                <p class="edu-hero-sub reveal delay-3">
                    ¿Sabías que todo lo que tocas está lleno de partículas bailando sin parar? ¡Vamos a descubrirlas juntos! Desplázate hacia abajo para comenzar la aventura científica. 🚀
                </p>
                <div class="edu-hero-floater">🔬</div>
            </section>

            <!-- ══════════ SEC 1: Energía Térmica ══════════ -->
            <section class="edu-section reveal" style="background: linear-gradient(140deg, rgba(255,122,0,0.08) 0%, rgba(255,50,0,0.04) 100%); border: 1px solid rgba(255,122,0,0.12);">
                <div class="deco-particle" style="top:2rem;right:4rem;animation:floatA 5s ease-in-out infinite;">⚡</div>
                <div class="deco-particle" style="bottom:3rem;right:8rem;font-size:2.5rem;animation:floatB 7s ease-in-out infinite;">✨</div>

                <span class="edu-section-icon">🔥</span>
                <span class="edu-section-tag" style="color: #ff9a3c;">Concepto 1</span>
                <h2 class="edu-section-title">¿Qué es la Energía Térmica?</h2>
                <p class="edu-section-body">
                    Imagina que tienes miles de millones de pelotitas muy, muy pequeñas dentro de un objeto. ¡Esas pelotitas son los átomos y las moléculas! La <strong>energía térmica</strong> es el movimiento de todas esas pelotitas juntas. Cuando hace calor, las pelotitas se mueven rapidísimo. Cuando hace frío, se mueven más despacio.
                </p>
                <p class="edu-section-body edu-section-body-dim">
                    ¿Alguna vez frotaste tus manos y las sentiste calentitas? ¡Eso pasó porque el movimiento de frotar hizo que las moléculas de tu piel se movieran más rápido! Estabas creando energía térmica con tus propias manos. ¡Tú eres un científico sin saberlo!
                </p>
                <p class="edu-section-body">
                    La energía térmica no solo vive en las estufas o en el sol. Está en cada objeto que te rodea: en tu lápiz, en tu mochila, en el aire que respiras. Absolutamente todo tiene alguna cantidad de energía térmica, ¡incluso el hielo!
                </p>
                <div class="edu-callout reveal delay-1" style="background: rgba(255,122,0,0.1); border-left: 4px solid #ff7a00;">
                    <span class="edu-callout-icon">🧊</span>
                    <span style="font-family:'Nunito',sans-serif; opacity:0.85; font-size:1rem; line-height:1.6;">
                        Dato curioso: <strong>hasta el hielo tiene energía térmica</strong>, aunque muy poca. Sus moléculas tiemblan levemente, como si tuvieran frío ¡porque sí que lo tienen!
                    </span>
                </div>
            </section>

            <!-- ══════════ SPLIT: Calor vs Temperatura ══════════ -->
            <div class="edu-split">
                <div class="edu-split-card reveal reveal-left" style="background: linear-gradient(145deg, rgba(255,200,0,0.07), rgba(255,122,0,0.04)); border: 1px solid rgba(255,200,0,0.12);">
                    <div class="edu-split-big" style="color: #ffc200;">🌡️</div>
                    <p class="edu-split-label">Temperatura</p>
                    <p class="edu-split-body">Es como el <em>velocímetro</em> de las moléculas. Mide qué tan rápido se están moviendo en promedio. Se mide en grados (°C o °F). Es un número que nos dice si algo está caliente o frío.</p>
                </div>
                <div class="edu-split-card reveal reveal-right" style="background: linear-gradient(145deg, rgba(255,100,0,0.07), rgba(220,30,0,0.04)); border: 1px solid rgba(255,100,0,0.12);">
                    <div class="edu-split-big" style="color: #ff4d00;">♨️</div>
                    <p class="edu-split-label">Calor</p>
                    <p class="edu-split-body">Es la energía <em>que viaja</em> de un lugar caliente a uno frío. Como cuando acercas la mano a una taza de chocolate caliente y la sientes calentar. ¡El calor te está viajando de la taza a ti!</p>
                </div>
            </div>

            <!-- ══════════ SEC 2: Calor vs Temperatura ══════════ -->
            <section class="edu-section reveal" style="background: linear-gradient(140deg, rgba(97,255,202,0.05) 0%, rgba(0,200,150,0.03) 100%); border: 1px solid rgba(97,255,202,0.1);">
                <div class="deco-particle" style="top:3rem;right:5rem;animation:spin 20s linear infinite;font-size:2.2rem;">🌀</div>

                <span class="edu-section-icon">🌡️</span>
                <span class="edu-section-tag" style="color: #61ffca;">Concepto 2</span>
                <h2 class="edu-section-title">¡El calor y la temperatura NO son lo mismo!</h2>
                <p class="edu-section-body">
                    Muchas personas piensan que calor y temperatura significan lo mismo, ¡pero la ciencia los distingue! La <strong>temperatura</strong> es como el velocímetro del auto: te dice qué tan rápido van las moléculas. El <strong>calor</strong>, en cambio, es como la gasolina que se pasa de un auto a otro.
                </p>
                <p class="edu-section-body">
                    Piensa en esto: si mezclas una taza de agua hirviendo con una piscina de agua fría, la temperatura de la taza bajará y la de la piscina subirá un poquito. El calor viajó de la taza (temperatura alta) a la piscina (temperatura más baja). ¡Siempre va del lugar más caliente al más frío!
                </p>
                <p class="edu-section-body edu-section-body-dim">
                    Un objeto jamás "guarda calor" en su interior. Lo que guarda es <strong>energía interna</strong>. El calor solo aparece cuando hay un intercambio entre dos objetos. Es como el dinero: no lo tienes hasta que alguien te lo da.
                </p>
                <div class="edu-callout reveal delay-2" style="background: rgba(97,255,202,0.07); border-left: 4px solid #61ffca;">
                    <span class="edu-callout-icon">💡</span>
                    <span style="font-family:'Nunito',sans-serif; opacity:0.85; font-size:1rem; line-height:1.6;">
                        <strong>Regla de oro:</strong> el calor siempre fluye de lo más caliente hacia lo más frío. ¡Nunca al revés! Es como el agua que baja por una montaña, siempre hacia abajo.
                    </span>
                </div>
            </section>

            <!-- ══════════ STEPS: Estados de la Materia ══════════ -->
            <section class="edu-steps reveal" style="background: linear-gradient(140deg, rgba(120,80,255,0.07) 0%, rgba(60,0,200,0.04) 100%); border: 1px solid rgba(150,100,255,0.12);">
                <div class="deco-particle" style="top:2rem;right:3rem;animation:floatB 6s ease-in-out infinite;font-size:3rem;">💫</div>
                <h2 class="edu-steps-title">🔄 Los 3 estados de la materia</h2>

                <div class="edu-step-row reveal delay-1">
                    <div class="edu-step-num" style="color:#7eb8ff;">①</div>
                    <div class="edu-step-content">
                        <h3 class="edu-step-heading">🧊 Sólido — Las moléculas se abrazan muy fuerte</h3>
                        <p class="edu-step-text">En los sólidos, las moléculas están muy juntas y apenas se pueden mover. Son como niños sentados en sus sillas. Por eso los sólidos tienen una forma fija. ¡El hielo, las piedras y tu escritorio son sólidos!</p>
                    </div>
                </div>

                <div class="edu-step-row reveal delay-2">
                    <div class="edu-step-num" style="color:#61ffca;">②</div>
                    <div class="edu-step-content">
                        <h3 class="edu-step-heading">💧 Líquido — Las moléculas bailan pegadas pero libres</h3>
                        <p class="edu-step-text">Al agregar más calor, las moléculas se sueltan un poco y comienzan a moverse entre ellas. Son como niños bailando en un salón: se quedan juntos pero se mueven. Por eso los líquidos toman la forma del recipiente donde los pones. ¡El agua, la leche y el jugo son líquidos!</p>
                    </div>
                </div>

                <div class="edu-step-row reveal delay-3">
                    <div class="edu-step-num" style="color:#ff9a3c;">③</div>
                    <div class="edu-step-content">
                        <h3 class="edu-step-heading">💨 Gas — Las moléculas vuelan por todos lados</h3>
                        <p class="edu-step-text">Con aún más calor, las moléculas se separan completamente y salen volando en todas direcciones, ¡como niños corriendo en el recreo! Los gases no tienen forma propia y llenan todo el espacio disponible. El aire que respiras es un gas.</p>
                    </div>
                </div>
            </section>

            <!-- ══════════ SEC 3: Transiciones de fase ══════════ -->
            <section class="edu-section reveal" style="background: linear-gradient(140deg, rgba(100,150,255,0.06) 0%, rgba(50,100,255,0.03) 100%); border: 1px solid rgba(100,150,255,0.1);">
                <div class="deco-particle" style="top:2rem;right:6rem;animation:floatA 4.5s ease-in-out infinite;">❄️</div>
                <div class="deco-particle" style="bottom:2rem;right:2rem;animation:floatC 5.5s ease-in-out infinite;">🌊</div>

                <span class="edu-section-icon">🧊➡️💧➡️💨</span>
                <span class="edu-section-tag" style="color: #7eb8ff;">Concepto 3</span>
                <h2 class="edu-section-title">¿Por qué el hielo se derrite y el agua se evapora?</h2>
                <p class="edu-section-body">
                    ¡Es una batalla épica! Por un lado están las <strong>fuerzas de atracción</strong>, que son como imanes que mantienen a las moléculas juntas y quieren que todo permanezca sólido. Por el otro lado está la <strong>energía térmica</strong>, que sacude y empuja a las moléculas para separarlas.
                </p>
                <p class="edu-section-body">
                    Cuando el calor gana la batalla, las moléculas se liberan y el estado cambia. Primero el hielo se vuelve agua (se funde), y después el agua se vuelve vapor (se evapora). ¡Y este proceso también puede ir al revés! Cuando el frío gana, el vapor se vuelve agua (se condensa) y el agua se vuelve hielo (se congela).
                </p>
                <p class="edu-section-body edu-section-body-dim">
                    Los cambios de estado son como transformaciones mágicas de la materia. El agua puede ser los tres: hielo, agua y vapor. ¡La misma sustancia con tres "disfraces" distintos dependiendo de la temperatura!
                </p>
                <div class="edu-callout reveal delay-2" style="background: rgba(100,150,255,0.08); border-left: 4px solid #7eb8ff;">
                    <span class="edu-callout-icon">🏔️</span>
                    <span style="font-family:'Nunito',sans-serif; opacity:0.85; font-size:1rem; line-height:1.6;">
                        <strong>¡En la naturaleza lo vemos todos los días!</strong> Las nubes son agua evaporada que se condensó en el cielo. La lluvia es ese vapor que vuelve a ser líquido. ¡El ciclo del agua es energía térmica en acción!
                    </span>
                </div>
            </section>

            <!-- ══════════ FUN FACT BANNER ══════════ -->
            <section class="edu-banner reveal" style="background: linear-gradient(135deg, #ff4d00 0%, #ff7a00 50%, #ffc200 100%);">
                <div class="edu-banner-stars">
                    ${Array.from({length: 10}, (_, i) => `<span class="edu-banner-star" style="left:${8+i*9}%;top:${10+((i*37)%70)}%;animation-delay:${i*0.15}s;">${['⭐','🌟','✨','💫'][i%4]}</span>`).join('')}
                </div>
                <span class="edu-banner-emoji">🤯</span>
                <h2 class="edu-banner-title">¡Dato que vuela la mente!</h2>
                <p class="edu-banner-body">
                    En una sola gota de agua hay más moléculas que estrellas visibles en todo el cielo nocturno. ¡Y cada una de esas moléculas se está moviendo ahora mismo! La materia nunca, jamás, se queda quieta del todo.
                </p>
            </section>

            <!-- ══════════ SEC 4: Repaso visual ══════════ -->
            <section class="edu-section reveal" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);">
                <span class="edu-section-icon">📋</span>
                <span class="edu-section-tag" style="color: rgba(255,255,255,0.5);">Antes del desafío</span>
                <h2 class="edu-section-title">Recuerda lo más importante</h2>
                <p class="edu-section-body">
                    Acabas de aprender mucho. Aquí va un resumen rápido para que no se te olvide nada antes de responder las preguntas del desafío:
                </p>

                <div style="display:grid; gap:1rem; max-width:680px; margin-top:1rem;">
                    ${[
                        ['🔥','Energía térmica','es el movimiento de todas las moléculas de un objeto. ¡Más calor = más movimiento!'],
                        ['🌡️','Temperatura','mide la velocidad promedio de las moléculas. Es el velocímetro molecular.'],
                        ['♨️','Calor','es energía en viaje: siempre va de lo caliente a lo frío.'],
                        ['🔄','Estados de la materia','sólido, líquido y gas. Cambian según cuánta energía térmica haya.'],
                    ].map(([icon, titulo, texto], i) => `
                        <div class="reveal delay-${i+1}" style="display:flex;gap:1rem;align-items:flex-start;padding:1.2rem 1.4rem;border-radius:18px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
                            <span style="font-size:1.8rem;flex-shrink:0;">${icon}</span>
                            <span style="font-family:'Nunito',sans-serif;font-size:1rem;line-height:1.6;opacity:0.85;"><strong style="color:#fff;">${titulo}:</strong> ${texto}</span>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- ══════════ QUIZ ══════════ -->
            <section class="edu-quiz-wrap reveal">
                <h2 class="edu-quiz-title">🔥 Desafío Térmico</h2>
                <p class="edu-quiz-sub">Basándote en todo lo que leíste, elige la respuesta correcta para cada pregunta. ¡Tú puedes! 💪</p>

                <div id="quiz-questions">
                    ${limitedQuestions.map((q, index) => {
                        const options = q.options || [q.correct_answer, "Opción Incorrecta A", "Opción Incorrecta B"];
                        const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
                        return `
                            <div class="edu-question-block">
                                <p class="edu-question-text">${index + 1}. ${q.question}</p>
                                <div class="edu-options" data-id="${q.id}">
                                    ${shuffledOptions.map(opt => `
                                        <button type="button" class="edu-option-btn" data-value="${opt}">${opt}</button>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>

                <button id="submit-btn" class="edu-submit-btn">✨ Enviar Desafío</button>
                <div id="quiz-results"></div>
            </section>

        </div>
    `;

    /* ── Scroll reveal observer ── */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.12 });

    container.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => observer.observe(el));

    /* ── Option selection ── */
    container.querySelectorAll('.edu-options').forEach(optGroup => {
        const questionId = optGroup.getAttribute('data-id');
        const buttons = optGroup.querySelectorAll('.edu-option-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                buttons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedAnswers[questionId] = btn.getAttribute('data-value');
            });
        });
    });

    /* ── Submit ── */
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', async () => {
        if (Object.keys(selectedAnswers).length < limitedQuestions.length) {
            alert('¡Responde las 3 preguntas antes de enviar! 😊');
            return;
        }

        const answersPayload = Object.keys(selectedAnswers).map(qId => ({
            questionId: qId,
            answer: selectedAnswers[qId]
        }));

        submitBtn.disabled = true;
        submitBtn.innerText = '⏳ Evaluando...';

        try {
            const result = await validateAnswers(answersPayload);
            renderResults(result, limitedQuestions);
            if (onQuizComplete) onQuizComplete();
        } catch (error) {
            console.error(error);
            alert('Error en la verificación del servidor.');
            submitBtn.disabled = false;
            submitBtn.innerText = '✨ Enviar Desafío';
        }
    });
};

const renderResults = (result, originalQuestions) => {
    const resultsContainer = document.getElementById('quiz-results');
    document.getElementById('submit-btn').style.display = 'none';
    document.querySelectorAll('.edu-option-btn').forEach(btn => btn.disabled = true);

    // Normalize top-level — backend returns fields at root level (no nested 'data')
    const payload = result?.data ?? result;

    // ✅ FIXED: backend uses 'correctAnswers', not 'correctCount'
    const correctCount = payload.correctAnswers ?? payload.correctCount ?? payload.correct_count ?? 0;
    // ✅ FIXED: always use the real number of questions shown (3), ignore backend's totalQuestions
    const totalQuestions = originalQuestions.length;
    const score = (correctCount / totalQuestions) * 10;

    // ✅ FIXED: backend returns array under 'results'
    const details = payload.results ?? payload.details ?? payload.feedback ?? payload.answers ?? [];

    const emoji = correctCount === totalQuestions ? '🏆' : correctCount >= 2 ? '🌟' : '💪';

    resultsContainer.innerHTML = `
        <div class="edu-results-summary">
            <div style="font-size:4rem; margin-bottom:0.5rem;">${emoji}</div>
            <h3 style="font-family:'Fredoka One',cursive; color: var(--accent-orange, #ff7a00); margin: 0 0 0.5rem; font-size:2rem; font-weight:400;">Resultados Obtenidos</h3>
            <div class="edu-score-num">${correctCount} / ${totalQuestions}</div>
            <p style="font-family:'Nunito',sans-serif; opacity:0.75; margin:0.5rem 0 0;">Calificación: <strong style="color:#fff;">${Number(score).toFixed(1)} / 10</strong></p>
        </div>

        <div class="edu-feedback-grid">
            ${details.map(detail => {
                const qId = detail.questionId ?? detail.question_id ?? detail.id;
                const orig = originalQuestions.find(q => q.id === qId);

                // ✅ FIXED: use strict equality to avoid null/undefined being truthy
                const ok = detail.correct === true || detail.isCorrect === true || detail.is_correct === true;

                const correctAnswer = detail.correctAnswer ?? detail.correct_answer ?? detail.expected ?? '';

                // ✅ FIXED: backend uses 'selectedAnswer', not 'userAnswer'
                const userAnswer = detail.selectedAnswer ?? detail.userAnswer ?? detail.user_answer ?? detail.answer ?? detail.selected ?? 'Ninguna';

                return `
                    <div class="edu-feedback-item" style="border: 1.5px solid ${ok ? '#22c55e' : '#ef4444'}; background: ${ok ? 'rgba(34,197,94,0.04)' : 'rgba(239,68,68,0.04)'};">
                        <p class="edu-feedback-q">${orig ? orig.question : (detail.question ?? 'Pregunta')}</p>
                        <p class="edu-feedback-a">Tu respuesta: <span style="color:${ok ? '#4ade80' : '#f87171'}">${userAnswer} ${ok ? '✅' : '❌'}</span></p>
                        ${!ok ? `<p class="edu-feedback-a">Respuesta correcta: <span style="color:#61ffca">${correctAnswer} ✨</span></p>` : ''}
                    </div>
                `;
            }).join('')}
        </div>

        <button class="edu-retry-btn" onclick="window.location.reload()">🔁 Intentar de nuevo</button>
    `;
};