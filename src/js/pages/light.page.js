import { getSections } from "../api/section6.api";
import { createHero } from "../components/hero";
import { createSection } from "../components/section";

export async function loadLightPage() {

    const app =
        document.querySelector("#app");

    app.innerHTML = "";

    const response =
        await getSections();

    const sections =
        response.data;

    sections.forEach(section => {

        if (section.type === "hero") {

            app.appendChild(
                createHero(section)
            );

            return;
        }

        app.appendChild(
            createSection(section)
        );

    });

}