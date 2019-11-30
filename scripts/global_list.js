// variabili di appoggio per salvare temporaneamente tutto
var nomi_ingrediente = [],
immagini_ingredienti = [],
nomi_azioni = [],
apoggio,
appoggio2;

// le due variabili da salvare in cache
var ingredienti_globali = [],
azioni_globali = [];

// funzione che mi permette di tirar fuori le cose dal json
$.getJSON("ingredienti_global.json", function (data) {
    // cerco per ogni elemento il valore da inserire nell'array corrispondente
    $.each(data, function (key,val) {
        nomi_ingrediente.push(val.nome);
        immagini_ingredienti.push(val.immagine);
        appoggio = { nome: val.nome, immagine: val.immagine };
        ingredienti_globali.push(appoggio);
    });
    sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));
});

// funzione che mi permette di tirar fuori le cose dal json
$.getJSON("azioni_global.json", function (data) {
    // cerco per ogni elemento il valore da inserire nell'array corrispondente
    $.each(data, function (key, val) {
        nomi_azioni.push(val.nome);
        appoggio2 = {nome: val.nome};
        azioni_globali.push(appoggio2);
    });
    sessionStorage.setItem("azioni_global", JSON.stringify(azioni_globali));
});