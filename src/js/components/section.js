export function createSection(
    section
) {

    const element =
        document.createElement("section");

    element.classList.add(
        "content-section"
    );

    element.style.backgroundColor =
        section.background_color;

    element.style.color =
        section.text_color;

    element.innerHTML = `
        <div class="section-content">

            <h2>
                ${section.title}
            </h2>

            ${
                section.image
                    ? `
                    <img
                        src="http://localhost:3000${section.image}"
                        alt="${section.title}"
                    >
                    `
                    : ""
            }

            <p>
                ${section.description}
            </p>

        </div>
    `;

    return element;
}