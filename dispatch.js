async function main() {

    const mapping = {
        'ponyfiction.org': 'ponyfiction',
        '': 'fb2',
    };

    const platform = mapping[window.location.hostname];

    if (platform == null) {
        throw new Error(`Unsupported host: ${window.location.hostname}`);
    }

    const root = "https://raw.githubusercontent.com/Veetaha/bookamre/master";
    const scripts = ["lib", `platforms/${platform}`];

    const codeParts = scripts.map(
        script => fetch(`${root}/${script}.js`).then(response => response.text())
    );

    const code = await Promise.all(codeParts);

    new Function(code.join("\n"))();
}

main()
