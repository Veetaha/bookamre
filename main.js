document.ctx = {
    offset: 0,
    limit: 3500,
    query: "mare,pony,score.gt:850,cute,!human,!anime,!eg",
}

fetch("https://raw.githubusercontent.com/Veetaha/bookamre/master/dispatch.js")
    .then(response => response.text())
    .then(code => new Function("ctx", code)(globalCtx))
