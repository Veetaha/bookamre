var ctx = {
    offset: 0,
    readers: 3,
    capacity: 10000,
    query: "mare,pony,score.gt:850,cute,!human,!anime,!eg",
}

fetch("https://corsproxy.io/?https://raw.githubusercontent.com/Veetaha/bookamre/v1/dispatch.js")
    .then(response => response.text())
    .then(code => new Function("ctx", code)(ctx))
