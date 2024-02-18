async function main() {
    document.head.appendChild(document.createElement("style")).textContent = `
        .fb2-reader-container-pages {
            display: none
        }
    `;

    const fragment = location.hash;
    let section = document.querySelector(`section:has(${fragment})`);
    let ctx = globalCtx();

    while (ctx.limit > 0 && section != null) {
        const wordsInSection = await chunkTextUnderNode(section, ctx);
        ctx.limit -= wordsInSection;
        ctx.offset = 0;
        section = section.nextElementSibling;
    }
}

main()
