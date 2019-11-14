// variabili di appoggio per salvare temporaneamente tutto
var nomi_ingrediente = [];
var immagini_ingredienti = [];
var ingredienti_globali = [];
var nomi_azioni = [];
var immagini_azioni = [];
var azioni_globali = [];
var apoggio;
var appoggio2;

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
        immagini_azioni.push(val.immagine);
        appoggio2 = { nome: val.nome, immagine: val.immagine };
        azioni_globali.push(appoggio2);
    });
    

});