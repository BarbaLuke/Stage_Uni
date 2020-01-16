// variabili di appoggio per salvare temporaneamente tutto
var nomi_ingrediente = [],
    immagini_ingredienti = [],
    nomi_azioni = [],
    immagini_azioni = [],
    apoggio,
    appoggio2;

// le due variabili
    ingredienti_globali = [],
    azioni_globali = [];

// funzione che mi permette di tirar fuori le cose dal json
var jqxhr = $.getJSON("ingredienti_global.json");
jqxhr.done(function (data) {
    $.each(data, function (key, val) {
        nomi_ingrediente.push(val.nome);
        immagini_ingredienti.push(val.immagine);
        appoggio = { nome: val.nome, immagine: val.immagine };
        ingredienti_globali.push(appoggio);
    });
    sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));

});

var jqxhr2 = $.getJSON("azioni_global.json");
jqxhr2.done(function (data) {
    $.each(data, function (key, val) {
        nomi_azioni.push(val.nome);
        immagini_azioni.push(val.immagine);
        appoggio2 = { nome: val.nome, immagine: val.immagine };
        azioni_globali.push(appoggio2);
    });
    sessionStorage.setItem("azioni_global", JSON.stringify(azioni_globali));

});