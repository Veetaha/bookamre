async function main() {
    const fragment = location.hash;
    let section = document.querySelector(`section:has(${fragment})`);
    let ctx = globalCtx();

    while (ctx.limit > 0 && section != null) {
        const wordsInSection = await chunkTextUnderNode(section, ctx);
        ctx.limit -= wordsInSection - ctx.offset;
        ctx.offset = 0;
        section = section.nextElementSibling;
    }
}

main()
