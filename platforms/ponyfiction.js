async function main() {
    document.head.appendChild(document.createElement("style")).textContent = `
        .container, .story-panel {
            background-color: var(--background-color);
        }
        .chapter-text, .chapter-text > hr {
            color: #d3d3d3;
        }
        :root {
            --background-color: #1E1E1E;
        }
        body {
            background-image: none
        }
    `;

    let rootElem = document.getElementsByClassName("chapter-text")[0];

    chunkTextUnderNode(rootElem);
}

main()
