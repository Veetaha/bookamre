async function main() {
    document.head.appendChild(document.createElement("style")).textContent = `
        .container, .story-panel {
            background-color: var(--background-color);
        }
        .chapter-text {
            color: #fff;
        }
        :root {
            --background-color: #1E1E1E;
        }
        body {
            background-image: none
        }
    `;

    let { offset, capacity, readers, query } = ctx;

    let limit = Math.floor(capacity / readers);
    let derpi = {
        query,
        filter: "100073",
        apiEndpoint: "https://derpibooru.org/api/v1/json",
    }

    let rootElem = document.getElementsByClassName("chapter-text")[0];

    let totalWords = 0;
    let chunkWordsNumber = 0;

    let toInsert = [];

    for (const textNode of flattenNode(rootElem)) {
        const words = splitWords(textNode.textContent);

        let milestoneLimit = toInsert.length === 0 ? offset : limit;

        if (chunkWordsNumber + words.length > milestoneLimit) {
            chunkWordsNumber = words.length;
            toInsert.push([createMilestoneElement(totalWords), textNode]);
        }

        chunkWordsNumber += words.length;
        totalWords += words.length;

        if (textNode.nextElementSibling?.tagName == "HR") {
            textNode.nextElementSibling.textContent = `{Chunk ~${totalWords} words} `;
        }
    }

    toInsert.push([createMilestoneElement(totalWords), null])

    for (const [milestone, elem] of toInsert) {
        const parent = elem?.parentNode ?? rootElem;
        parent.insertBefore(await milestone, elem);
    }

    console.log(`Total words: ${totalWords}`);

    /** @param {number} wordsNumber */
    async function createMilestoneElement(wordsNumber) {
        const milestone = createMilestoneMarkerTextElement(wordsNumber);
        const image = document.createElement("img");
        image.src = await getRandomImage();

        let div = document.createElement("div");
        div.append(milestone, image);
        return div;
    }

    /** @param {number} wordsNumber */
    function createMilestoneMarkerTextElement(wordsNumber) {
        const milestone = document.createElement("div");
        milestone.style.fontFamily = "Consolas";
        milestone.style.fontWeight = "bold";
        milestone.innerText = `{Milestone ~${wordsNumber} words}`;
        return milestone;
    }

    async function getRandomImage() {
        let queryParams = `&filter=${derpi.filter}&q=${derpi.query}`;
        let response = await fetch(`${derpi.apiEndpoint}/search/images?sf=random&per_page=1${queryParams}`)
            .then(res => res.json());
        return response.images[0].view_url;
    }

    /** @param {string} text */
    function splitWords(text) {
        return String(text).match(/((?:[a-фяёґєї]|\w)+)/gi) ?? [];
    }

    /**
     *  @param {Node} node
     *  @returns {Node[]}
     */
    function flattenNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return node;
        }
        return [...node.childNodes].flatMap(flattenNode);
    }
}

main()
