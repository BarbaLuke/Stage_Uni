// array che conterranno in ordine: INGREDIENTI, POST delle AZIONI e
//  la differenza dei primi due
var ingredienti_totali = [];

// arrai che conterrà le azioni
var azioni = [];

// array che contiene i link
var link = [];

var ingredienti_globali =
    JSON.parse(sessionStorage.getItem("ingredienti_global"));

// link da aggiungere dopo
var link_dopo = [];

// lista con delle info sui nodi
var lista_adj = [];

// variabili di supporto
var x, i, y, z, j, k, vara, vara2;


//creo questa lista sdoppiata per far sdoppiare i nodi con più di un
// collegamento lo faccio per facilitare la mia funzione ricorsiva per
// la ricerca del cammino per ogni nodo fino alla fine
var lista2 = lista_adj;

// per ogni nodo creo una lista che contiene il cammino massimo che quel nodo 
// possiede per arrivare alla fine della ricetta
var lista_cammini = [];

// questa mi serve per contenere il massimo cammino e inserislo poi nelle info    
var max_cammino = 0;


// creo due liste in lista_inseriti tengo tutti i nodi e le posizioni
// in due dimensioni del mio nodo
var lista_inseriti = [];

// in lista_nodi invece tengo solo l'id dei nodi cui ho modificato la posizione
var lista_nodi = [];

//Funzione di richiamo del file xml appena inserito
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        calcolo_liste(this);
    }
};

//Utilizzo sessionStorage per trovare il nome del file da aprire
//Questo però funziona solo quando il tab rimane aperto
//Se chiudo il tab la sessione viene automaticamente chiusa
// insieme alla sparizione dei miei dati
xhttp.open("GET", "ricette/" + sessionStorage.getItem("nome_file"), true);
xhttp.send();

function calcolo_liste(xml) {
    // questo sotto è il risultato della funzione di richiamo cioè il file xml
    var xmlDoc = xml.responseXML;

    // mi servono tutti i figli del nodo centrale
    x = xmlDoc.documentElement.childNodes;

    // con questo ciclo riempio gli array che mi serviranno da appoggio per 
    // sviluppare il grafico
    for (i = 0; i < x.length; i++) {

        // con questo rimpio l' array con i link diretti tra le azioni
        if (x[i].nodeType == 1 && x[i].nodeName === "RELAZIONEdORDINE") {

            vara = {
                source: x[i].getAttribute('IDazionePrec'),
                target: x[i].getAttribute('IDazioneSucc')
            };

            link.push(vara);
        }

        // con questo invece riempio l'array con i link in loop tra le azioni
        if (x[i].nodeType == 1 && x[i].nodeName === "RELAZIONEdiSIMULT") {

            vara = {
                source: x[i].getAttribute('IDazioneDurevole'),
                target: x[i].getAttribute('IDazioneCondizione')
            };

            vara2 = {
                source: x[i].getAttribute('IDazioneCondizione'),
                target: x[i].getAttribute('IDazioneDurevole')
            };

            link.push(vara2);
            link.push(vara);
        }

        // con questo riempio l'array degli ingredienti
        if (x[i].nodeType == 1 && x[i].nodeName === "INGREDIENTE") {

            // devo distinguere nel caso in cui l'ingrediente non abbia definito
            // il tag QUANTITA
            if (typeof x[i].childNodes[3] !== "undefined") {

                vara = {
                    id: x[i].getAttribute('IDingrediente'),
                    nome: x[i].childNodes[1].childNodes[0].nodeValue,
                    quantita: x[i].childNodes[3].childNodes[0].nodeValue,
                    immagine: ""
                };

            } else {

                vara = {
                    id: x[i].getAttribute('IDingrediente'),
                    nome: x[i].childNodes[1].childNodes[0].nodeValue,
                    quantita: "",
                    immagine: ""
                };

            }

            ingredienti_totali.push(vara);
        }

        // devo riempire l'array dei POST e PRE delle AZIONI
        //  quindi vado a cercare i nodi figli delle AZIONI
        if (x[i].nodeType == 1 && x[i].nodeName === "AZIONE") {

            y = x[i].childNodes;
            let durat = "";
            let cond = "";

            // trovati tutti i figli delle AZIONI devo cercare solo quelli PRE e
            //  POST
            for (j = 0; j < y.length; j++) {
                // cerco la durata della mia azione, in caso non la trovi
                // rimane comunque un valore settato a nulla
                if (y[j].nodeType == 1 && y[j].nodeName === "DUREVOLE") {

                    durat = y[j].childNodes[0].nodeValue;

                }
                // cerco la durata della mia azione, in caso non la trovi
                // rimane comunque un valore settato a nulla
                if (y[j].nodeType == 1 && y[j].nodeName === "CONDIZIONE") {

                    cond = y[j].childNodes[0].nodeValue;

                }
                // cerco i PRE e POST per riempire l'array dei link
                if (y[j].nodeType == 1 && (y[j].nodeName === "POST"
                    || y[j].nodeName === "PRE")) {

                    z = y[j].childNodes;

                    // trovati i PRE e i POST vado a cercare di capire com'è 
                    // strutturato il link
                    for (k = 0; k < z.length; k++) {

                        if (z[k].nodeType == 1
                            && z[k].nodeName === "INGREDIENTE") {

                            // se l'ingrediente è un risultato dell'azione 
                            // allora il link sarà fatto così
                            if (y[j].nodeName === "POST") {

                                vara = {
                                    source: x[i].getAttribute('IDazione'),
                                    target: z[k].getAttribute('IDingrediente')
                                };
                            }

                            // se l'ingerdiente è un requisito allora
                            //  il link sarà fatto cos'
                            if (y[j].nodeName === "PRE") {

                                vara = {
                                    source:
                                        z[k].getAttribute('IDingrediente'),
                                    target: x[i].getAttribute('IDazione')
                                };
                            }

                            // infine riempio l'array link con il risultato
                            link.push(vara);
                        }
                    }
                }
            }
            // intanto riempio l'array delle azioni
            vara = {
                id: x[i].getAttribute('IDazione'),
                nome: x[i].childNodes[1].childNodes[0].nodeValue,
                durata: durat,
                condizione: cond
            };
            azioni.push(vara);
        }
    }

    // queste vanno ad aggiornare la lista delle componenti 
    // globali in base al nome vado ad aggiornare il tutto
    for (d = 0; d < ingredienti_totali.length; d++) {

        for (b = 0; b < ingredienti_globali.length; b++) {

            if (ingredienti_globali[b].nome.replace(/\s+/g, '') === ingredienti_totali[d].nome.replace(/\s+/g, '')) {

                if (ingredienti_globali[b].immagine !== "") {

                    ingredienti_totali[d].immagine = ingredienti_globali[b].immagine;

                }
            }
        }
    }



    function relazio(risorsa, puntato) {
        if (risorsa.includes("i") && puntato.includes("a")) {
            return "Pre-Condizione";
        } else if (puntato.includes("i") && risorsa.includes("a")) {
            return "Post-Condizione";
        } else {
            let simul = false;
            for (q = 0; q < link.length; q++) {
                if (link[q].source === puntato && link[q].target === risorsa &&
                    !simul) {
                    simul = true;
                }
            }
            if (simul) {
                return "Relazione di Simultaneità";
            } else {
                return "Relazione d'Ordine";
            }
        }
    };

    function trovanome(iid) {
        if (iid.includes("i")) {
            for (w = 0; w < ingredienti_totali.length; w++) {
                if (ingredienti_totali[w].id === iid) {
                    return ingredienti_totali[w].nome;
                }
            }
        } else {
            for (w = 0; w < azioni.length; w++) {
                if (azioni[w].id === iid) {
                    return azioni[w].nome;
                }
            }
        }
    }

    function trovapre(azione) {
        let pre = [];
        for (a = 0; a < link.length; a++) {
            if (link[a].target === azione && link[a].source.includes("i")) {
                pre[pre.length] = link[a].source + ". " +
                    trovanome(link[a].source);
            }
        }
        return pre;
    }

    function trovapost(azione) {
        let post = [];
        for (a = 0; a < link.length; a++) {
            if (link[a].source === azione && link[a].target.includes("i")) {
                post[post.length] = link[a].target + ". " +
                    trovanome(link[a].target);
            }
        }
        return post;
    }

    for (i = 0; i < ingredienti_totali.length; i++) {
        text = "<tr>";
        text += '<th scope="row">' + ingredienti_totali[i].id + "</th>";
        text += "<td>" + ingredienti_totali[i].nome + "</td>";
        text += "<td>" + ingredienti_totali[i].quantita + "</td>";
        if (ingredienti_totali[i].immagine !== "") {

            text += "<td> <a href='" + ingredienti_totali[i].immagine + "' target='_blank'> visualizza immagine </a></td>";

        } else {
            text += "<td></td>";
        }

        text += '<td><button id="' + ingredienti_totali[i].id +
            '" class="btn-warning btn btn-sm shadow-sm modifica_ingre">\n\
<i class="fas fa-edit"></i></button> <button id="' + ingredienti_totali[i].id +
            "del" +
            '" class="btn-danger shadow-sm btn btn-sm cancella_ingre">\n\
<i class="fas fa-trash"></i></button></td>';
        text += "</tr>";
        let ing = document.getElementById("ingredienti");
        if (ing !== null) {
            ing.innerHTML += text;
        }
    }

    for (i = 0; i < azioni.length; i++) {
        let pre_cond = trovapre(azioni[i].id);
        let post_cond = trovapost(azioni[i].id);
        text3 = "<tr>";
        text3 += '<th scope="row">' + azioni[i].id + "</th>";
        text3 += "<td>" + azioni[i].nome + "</td>";
        text3 += "<td>" + azioni[i].durata + "</td>";

        if (pre_cond !== []) {
            text3 += "<td> <ul>";
            for (e = 0; e < pre_cond.length; e++) {
                text3 += "<li>" + pre_cond[e] + "</li>";
            }
            text3 += "</ul></td>";
        }
        if (post_cond !== []) {
            text3 += "<td> <ul>";
            for (e = 0; e < post_cond.length; e++) {
                text3 += "<li>" + post_cond[e] + "</li>";
            }
            text3 += "</ul></td>";
        } else if (post_cond === []) {
            text3 += "<td></td>";
        } else if (pre_cond === []) {
            text3 += "<td></td>";
        }
        text3 += '<td><button id="' + azioni[i].id +
            '" class="btn-warning btn btn-sm shadow-sm modifica_azio">\n\
<i class="fas fa-edit"></i></button> <button id="' + azioni[i].id + "del" +
            '" class="btn-danger shadow-sm btn btn-sm cancella_azio">\n\
<i class="fas fa-trash"></i></button></td>';
        text3 += "</tr>";
        let az = document.getElementById("azioni");
        if (az !== null) {
            az.innerHTML += text3;
        }
    }
    for (i = 0; i < link.length; i++) {
        let tipo_rel = relazio(link[i].source, link[i].target);
        let nome_source = trovanome(link[i].source);
        let nome_target = trovanome(link[i].target);
        text2 = "<tr>";
        text2 += '<td>' + link[i].source + ". <strong>" + nome_source +
            "</strong></td>";
        text2 += "<td>" + link[i].target + ". <strong>" + nome_target +
            "</strong></td>";
        text2 += "<td>" + tipo_rel + "</td>";
        text2 += '<td><button id="' + link[i].source + "_" + link[i].target +
            '" class="btn-warning btn btn-sm shadow-sm modifica_link">\n\
<i class="fas fa-edit"></i></button> <button id="' + link[i].source + "_" +
            link[i].target + "del" +
            '" class="btn-danger shadow-sm btn btn-sm cancella_link">\n\
<i class="fas fa-trash"></i></button></td>';
        text2 += "</tr>";
        let li = document.getElementById("link");
        if (li !== null) {
            li.innerHTML += text2;
        }
    }

    function trova_quan(iddiii) {
        for (i = 0; i < ingredienti_totali.length; i++) {
            if (ingredienti_totali[i].id === iddiii) {
                return ingredienti_totali[i].quantita;
            }
        }
    }

    function trova_imma(idda) {
        for (i = 0; i < ingredienti_totali.length; i++) {
            if (ingredienti_totali[i].id === idda) {
                return ingredienti_totali[i].immagine;
            }
        }
    }

    function trova_durata(id_az) {
        for (i = 0; i < azioni.length; i++) {
            if (azioni[i].id === id_az) {
                return azioni[i].durata;
            }
        }
    }
    function trova_condizione(id_azi) {
        for (i = 0; i < azioni.length; i++) {
            if (azioni[i].id === id_azi) {
                return azioni[i].condizione;
            }
        }
    }

    function cerca_ultimo_id_ingredienti() {
        let massimo = 0;
        for (i = 0; i < ingredienti_totali.length; i++) {
            let nuovo_id = ingredienti_totali[i].id;
            let temporaneo = nuovo_id.split("i");
            if (parseInt(temporaneo[0]) > massimo) {
                massimo = parseInt(temporaneo[0]);
            }
        }
        return (massimo + 1) + "i";
    }

    // Funzione modifica ingrediente delle tabelle
    $(".modifica_ingre").click(function (evt) {
        let modda = true;
        $('#modda_ingrediente').modal({
            show: true
        });
        let idi = $(this).attr("id");
        nome_ingr = trovanome($(this).attr("id"));
        quan_ingr = trova_quan($(this).attr("id"));
        imma_ingr = trova_imma($(this).attr("id"));
        $("#nome_nodo").val(nome_ingr);
        $("#quantita_nodo").val(quan_ingr);
        $("#immagine_nodo").val(imma_ingr);
        let idddi = document.getElementById("ingre_mod");
        idddi.innerHTML = "Modifica ingrediente " + idi;
        $("#salva_inserimento").click(function (ev) {
            if (modda === true) {

                let modifica = {
                    ricetta: sessionStorage.getItem("nome_file"),
                    id: idi,
                    nome: $("#nome_nodo").val(),
                    quantita: $("#quantita_nodo").val()
                };

                if (modifica.nome !== "") {

                    for (n = 0; n < ingredienti_globali.length; n++) {

                        if (ingredienti_globali[n].nome === nome_ingr) {

                            if (nome_ingr !== $("#nome_nodo").val()) {

                                ingredienti_globali[n].nome = $("#nome_nodo").val();
                                let modifica_nome = { nome_vecchio: nome_ingr, nome_nuovo: $("#nome_nodo").val() }
                                $.ajax({
                                    url: 'modifica_nome.php',
                                    type: 'POST',
                                    async: false,
                                    data: modifica_nome
                                });

                                if (imma_ingr !== $("#immagine_nodo").val()) {
                                    ingredienti_globali[n].immagine = $("#immagine_nodo").val();
                                    let insero = { nome: $("#nome_nodo").val(), immagine: $("#immagine_nodo").val() };
                                    $.ajax({
                                        url: 'aggiungi_modifica_immagine.php',
                                        type: 'POST',
                                        async: false,
                                        data: insero
                                    });
                                }

                            } else {

                                if (imma_ingr !== $("#immagine_nodo").val()) {
                                    ingredienti_globali[n].immagine = $("#immagine_nodo").val();
                                    let insero = { nome: nome_ingr, immagine: $("#immagine_nodo").val() };

                                    $.ajax({
                                        url: 'aggiungi_modifica_immagine.php',
                                        type: 'POST',
                                        data: insero
                                    });
                                }
                            }
                        }
                    }
                    sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));

                    $.ajax({
                        url: 'modifica_ingrediente.php',
                        type: 'POST',
                        data: modifica,
                        success: function () {
                            location.reload();
                        },
                        error: function () {
                            alert("qualcosa è andato storto");
                        }
                    });
                } else {
                    alert("hai dimenticato il nome");
                }
                modda = false;
            }
        });
        $("#annulla_insertnodo").click(function (ev) {

            modda = false;

        });
        $(".close").click(function (evw) {
            modda = false;
        });
    });

    // funzione cancella ingrediente delle tabelle
    $(".cancella_ingre").click(function (evt) {
        let canc = true;
        $('#elimina_ingrediente').modal({
            show: true
        });
        let idi = $(this).attr("id").split("del")[0];
        let idddi = document.getElementById("ingre_elim");
        idddi.innerHTML = "Elimina ingrediente " + idi;
        let testo = document.getElementById("testo_dentro");
        let nome_ingr = trovanome($(this).attr("id").split("del")[0]);
        testo.innerHTML = "Vuoi eliminare " + nome_ingr + " ?";
        $("#elimina_inserimento").click(function (ev) {
            if (canc === true) {

                let modifica = {
                    ricetta: sessionStorage.getItem("nome_file"),
                    id2: idi
                };

                $.ajax({
                    url: 'cancella_ingrediente.php',
                    type: 'POST',
                    data: modifica,
                    success: function () {
                        location.reload();
                    },
                    error: function () {
                        alert("qualcosa è andato storto");
                    }
                });

                canc = false;

            }

        });
        $("#annulla_eliminazione").click(function () {

            canc = false;

        });

        $(".close").click(function (evw) {
            canc = false;
        });
    });

    // funzione inserimento ingrediente nelle tabelle
    $("#inserisci_ingrediente").click(function (evt) {
        let inn = true;

        $('#insert_ingrediente').modal({
            show: true
        });

        $("#salva_inserimento2").click(function (ev) {
            if (inn === true) {

                let nome = $("#nome_nodo2").val();


                let quant = $("#quantita_nodo2").val();
                let imma = $("#immagine_nodo2").val();
                if (nome !== "") {

                    let non = true;

                    for (n = 0; n < ingredienti_globali.length; n++) {

                        if (ingredienti_globali[n].nome === nome) {
                            non = false;

                            if(imma.value !== ""){

                                let insero = {nome: ingredienti_globali[n].nome, immagine: imma}
                                $.ajax({
                                    url: 'aggiungi_modifica_immagine.php',
                                    type: 'POST',
                                    data: insero,
                                    success: function () {
                                        location.reload();
                                    },
                                    error: function () {
                                        alert("qualcosa è andato storto");
                                    }
                                });
                                ingredienti_globali[n].immagine = imma;
                                sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));

                            }else{
                                imma = ingredienti_globali[n].nome
                            }
                        }
                    }
                    if (non) {


                        vara_glob = { nome: $("#nome_nodo2").val(), immagine: imma };

                        ingredienti_globali.push(vara_glob);

                        sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));

                        $.ajax({
                            url: 'aggiungi_ingrediente_globale.php',
                            type: 'POST',
                            data: vara_glob
                        });

                    }

                    let idi = cerca_ultimo_id_ingredienti();
                    let inse = {
                        id: idi,
                        nome: nome,
                        quantita: quant,
                        immagine: imma
                    };
                    ingredienti_totali.push(inse);
                    let inse2 = {
                        ricetta: sessionStorage.getItem("nome_file"),
                        id: idi,
                        nome: nome,
                        quantita: quant
                    };
                    $.ajax({
                        url: 'inserimento_ingrediente.php',
                        type: 'POST',
                        data: inse2,
                        success: function () {
                            location.reload();
                        },
                        error: function () {
                            alert("qualcosa è andato storto");
                        }
                    });
                } else {
                    alert("hai dimenticato il nome");
                }

                inn = false

            }

        });

        $("#annulla_insertnodo2").click(function () {

            inn = false;

        });
        $(".close").click(function (evw) {
            inn = false;
        });
    });

    // Funzione modifica azione delle tabelle
    $(".modifica_azio").click(function (evt) {
        let moda = true;

        $('#modda_azione').modal({
            show: true
        });

        $("#non_indispensabile").hide();

        let id_az = $(this).attr("id");
        nome_azio = trovanome($(this).attr("id"));
        dur_azio = trova_durata($(this).attr("id"));
        cond_azio = trova_condizione($(this).attr("id"));

        $("#nome_nodo").val(nome_azio);
        $("#durata_nodo").val(dur_azio);
        $("#condizione_nodo").val(cond_azio);
        if (cond_azio !== "") {
            $("#non_indispensabile").show();
        }
        let iddddi = document.getElementById("azio_mod");
        iddddi.innerHTML = "Modifica azione " + id_az;
        $("#salva_inserimento_azione").click(function (ev) {
            if (moda === true) {

                let modifica_azionee = {
                    ricetta: sessionStorage.getItem("nome_file"),
                    id: id_az,
                    nome: $("#nome_nodo").val(),
                    durata: $("#durata_nodo").val(),
                    condizione: $("#condizione_nodo").val()
                };
                if (modifica_azionee.nome !== "") {
                    $.ajax({
                        url: 'modifica_azione.php',
                        type: 'POST',
                        data: modifica_azionee,
                        success: function () {
                            location.reload();
                        },
                        error: function () {
                            alert("qualcosa è andato storto");
                        }
                    });
                } else {
                    alert("hai dimenticato il nome");
                }

                moda = false;

            }


        });

        $("#annulla_insertnodo_azione").click(function () {

            moda = false;

        });
        $(".close").click(function (evw) {
            moda = false;
        });

    });

    var lista = document.getElementById("globali");

    for (a = 0; a < ingredienti_globali.length; a++) {
        let inni = "<option value='" + ingredienti_globali[a].nome + "'>" + ingredienti_globali[a].nome + "</option>";
        lista.innerHTML += inni;
    }
}


document.getElementById("scarico").href = "ricette/" +
    sessionStorage.getItem("nome_file");

document.getElementById("leggo").href = "ricette/" +
    sessionStorage.getItem("nome_file");
