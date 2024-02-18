function globalCtx() {
    return document.ctx ?? {
        offset: 0,
        limit: 5000,
    };
}

const derpibooruApiEndpoint = "https://derpibooru.org/api/v1/json/";

/**
 * @param {{ filter: string, query: string }} params
 * @returns {Promise<string>}
 */
async function getRandomImage(paramsOverride) {
    const params = paramsOverride ?? document.ctx;

    const url = new URL("search/images", derpibooruApiEndpoint)
    const queryParams = {
        sf: "random",
        per_page: 1,
        filter: params?.filter ?? "100073",
        q: params?.query ?? "mare,pony,score.gt:850,cute,!human,!anime,!eg"
    };

    for (const kv of Object.entries(queryParams)) {
        url.searchParams.set(...kv);
    }

    const response = await fetch(url).then(res => res.json());

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


/** @param {number} wordsNumber */
async function createMilestoneElement(wordsNumber) {
    const milestone = createMilestoneMarkerTextElement(wordsNumber);

    const mediaSrc = await getRandomImage();

    let media;

    if (mediaSrc.endsWith(".webm")) {
        media = document.createElement("video");
        media.controls = true;
    } else {
        media = document.createElement("img");
    }

    media.src = mediaSrc;
    media.style.maxWidth = "100%";

    let div = document.createElement("div");
    div.append(milestone, media);
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

/**
 * @param {Node} rootElem
 */
async function chunkTextUnderNode(rootElem, ctx = globalCtx()) {
    let totalWords = 0;
    let chunkWordsNumber = 0;

    let toInsert = [];

    let { offset, limit } = ctx;

    // Two milestones when an offset is used: one for the offset start, and one
    // for the actual limit.
    let totalMilestones = offset === 0 ? 2 : 1;

    for (const textNode of flattenNode(rootElem)) {
        const words = splitWords(textNode.textContent);

        if (totalMilestones > 0) {
            const milestoneLimit = toInsert.length === 0 ? offset : limit;

            if (chunkWordsNumber + words.length > milestoneLimit) {
                totalMilestones -= 1;
                chunkWordsNumber = words.length;
                toInsert.push([createMilestoneElement(totalWords), textNode]);
            }

            chunkWordsNumber += words.length;
        }

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

    return totalWords;
}

console.log("Using parameters:", globalCtx());
