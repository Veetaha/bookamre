function main() {
    const mapping = {
        'docs.google.com': 'google-docs',
        'ponyfiction.org': 'ponyfiction',
    };

    const platform = mapping[window.location.hostname];

    if (platform == null) {
        throw new Error(`Unsupported host: ${window.location.hostname}`);
    }

    fetch(`https://github.com/Veetaha/bookamre/blob/v1/platforms/${platform}.js`)
        .then(response => response.text())
        .then(code => new Function("ctx", code)(ctx))
}

main()
