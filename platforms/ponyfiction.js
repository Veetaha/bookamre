async function main() {
    let { offset, capacity, readers, query } = ctx;

    let limit = Math.floor(capacity / readers);
    let derpi = {
        query,
        filter: "100073",
        apiEndpoint: "https://derpibooru.org/api/v1/json",
    }

    let rootTextElem = document.getElementsByClassName("chapter-text")[0];

    let totalWords = 0;
    let chunkWordsNumber = 0;

    let toInsert = [];

    for (const textElem of rootTextElem.children) {
        const words = splitWords(textElem.innerText);

        let milestoneLimit = toInsert.length === 0 ? offset : limit;

        if (chunkWordsNumber + words.length > milestoneLimit) {
            chunkWordsNumber = words.length;
            toInsert.push([createMilestoneElement(totalWords), textElem]);
        }

        chunkWordsNumber += words.length;
        totalWords += words.length;

        if (textElem.nextElementSibling?.tagName == "HR") {
            textElem.nextElementSibling.textContent = `{Chunk ~${totalWords} words} `;
        }
    }

    toInsert.push([createMilestoneElement(totalWords), null])

    for (const [milestone, elem] of toInsert) {
        rootTextElem.insertBefore(await milestone, elem);
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
}

main()
