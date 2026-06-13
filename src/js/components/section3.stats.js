    // src/js/components/section3.stats.js
    import { fetchStats } from '../api/section3.api.js';

    export const renderStats = async (container) => {
        container.innerHTML = `
            <p style="font-family:'Nunito',sans-serif; text-align:center; opacity:0.5; margin-top:2rem;">
                Cargando estadísticas colectivas de la clase...
            </p>
        `;

        try {
            const statsData = await fetchStats();

            if (!statsData || statsData.length === 0) {
                container.innerHTML = `
                    <p style="font-family:'Nunito',sans-serif; text-align:center; opacity:0.5; margin-top:2rem;">
                        No hay datos estadísticos acumulados todavía.
                    </p>
                `;
                return;
            }

            container.innerHTML = `
                <section style="
                    width: 100%;
                    border-radius: 36px;
                    padding: 4rem;
                    margin-top: 3rem;
                    background: rgba(255,255,255,0.025);
                    border: 1px solid rgba(255,255,255,0.08);
                    backdrop-filter: blur(20px);
                    position: relative;
                    overflow: hidden;
                ">
                    <!-- Decorative particle -->
                    <span style="
                        position:absolute; top:2rem; right:3rem;
                        font-size:1.8rem; opacity:0.15; pointer-events:none;
                        animation: floatB 6s ease-in-out infinite;
                    ">📈</span>

                    <!-- Header -->
                    <h2 style="
                        font-family:'Fredoka One',cursive;
                        font-size: clamp(2rem, 4vw, 3rem);
                        font-weight: 400;
                        color: #fff;
                        margin: 0 0 0.5rem;
                    ">📊 Estadísticas del Aula</h2>
                    <p style="
                        font-family:'Nunito',sans-serif;
                        font-size: 1rem;
                        opacity: 0.6;
                        margin: 0 0 2.5rem;
                        line-height: 1.6;
                    ">Interacciones registradas por todos los estudiantes para cada pregunta.</p>

                    <!-- Stats grid -->
                    <div style="display:grid; gap:1rem;">
                        ${statsData.map(stat => {
                            const total = (stat.correctCount ?? 0) + (stat.incorrectCount ?? 0);
                            const percentage = total > 0 ? ((stat.correctCount / total) * 100).toFixed(1) : 0;
                            const isGood = percentage >= 60;

                            return `
                                <div style="
                                    background: rgba(0,0,0,0.2);
                                    padding: 1.4rem;
                                    border-radius: 18px;
                                    border: 1.5px solid ${isGood ? 'rgba(97,255,202,0.15)' : 'rgba(255,122,0,0.15)'};
                                    border-left: 4px solid ${isGood ? '#61ffca' : '#ff7a00'};
                                ">
                                    <!-- Question ID + percentage -->
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                                        <span style="
                                            font-family:'Nunito',sans-serif;
                                            font-weight:800;
                                            font-size:0.9rem;
                                            color:#fff;
                                            opacity:0.85;
                                        ">Pregunta: <code style="
                                            background:rgba(255,255,255,0.06);
                                            padding:0.1rem 0.5rem;
                                            border-radius:6px;
                                            font-size:0.85rem;
                                        ">${stat.number}</code></span>
                                        <span style="
                                            font-family:'Fredoka One',cursive;
                                            font-size:1.3rem;
                                            color:${isGood ? '#61ffca' : '#ff9a3c'};
                                        ">${percentage}%</span>
                                    </div>

                                    <!-- Correct / Incorrect counts -->
                                    <div style="display:flex; gap:1.5rem; font-family:'Nunito',sans-serif; font-size:0.88rem; opacity:0.8; margin-bottom:0.75rem;">
                                        <span>✅ Correctas: <strong style="color:#4ade80;">${stat.correctCount ?? 0}</strong></span>
                                        <span>❌ Incorrectas: <strong style="color:#f87171;">${stat.incorrectCount ?? 0}</strong></span>
                                        <span style="opacity:0.5;">Total: <strong>${total}</strong></span>
                                    </div>

                                    <!-- Progress bar -->
                                    <div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden;">
                                        <div style="
                                            width:${percentage}%;
                                            height:100%;
                                            background: linear-gradient(90deg, #ff7a00, #61ffca);
                                            border-radius:3px;
                                            transition: width 0.8s ease;
                                        "></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </section>
            `;

        } catch (error) {
            console.error('[renderStats] Error:', error);
            container.innerHTML = `
                <p style="font-family:'Nunito',sans-serif; text-align:center; color:#f87171; margin-top:2rem;">
                    Error al cargar las estadísticas.
                </p>
            `;
        }
    };