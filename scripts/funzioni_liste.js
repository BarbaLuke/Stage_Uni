//  array ingredienti
var ingredienti_totali = [];

// arrai che conterrà le azioni
var azioni = [];

var ingredienti_globali = JSON.parse(sessionStorage.getItem("ingredienti_global"));

var azioni_globali = JSON.parse(sessionStorage.getItem("azioni_global"));

// variabili di supporto
var x, i, y, z, j, k, vara, vara2, inno;

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
xhttp.open("GET", "ricette/" + sessionStorage.getItem("nome_file"), false);
xhttp.send();

function calcolo_liste(xml) {
    // questo sotto è il risultato della funzione di richiamo cioè il file xml
    var xmlDoc = xml.responseXML;

    // mi servono tutti i figli del nodo centrale
    x = xmlDoc.documentElement.childNodes;

    // con questo ciclo riempio gli array che mi serviranno da appoggio per 
    // sviluppare il grafico
    for (i = 0; i < x.length; i++) {

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
            }
            // intanto riempio l'array delle azioni
            vara = {
                id: x[i].getAttribute('IDazione'),
                nome: x[i].childNodes[1].childNodes[0].nodeValue,
                durata: durat,
                condizione: cond,
                immagine:""
            };
            azioni.push(vara);
        }
    }
}


function ricerca() {
    // Declare variables
    var input, filter, i, txtValue;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    table = document.getElementById("lista-globali");
    tr = table.getElementsByTagName('tr');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName('td')[0];
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

function ricerca_azione() {
    // Declare variables
    var input, filter, i, txtValue;
    input = document.getElementById('search_act');
    filter = input.value.toUpperCase();
    table = document.getElementById("lista-azioni-globali");
    tr = table.getElementsByTagName('tr');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName('td')[0];
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

document.getElementById("scarico").href = "ricette/" +
    sessionStorage.getItem("nome_file");

document.getElementById("leggo").href = "ricette/" +
    sessionStorage.getItem("nome_file");

var lista = document.getElementById("lista-globali");
var lista2 = document.getElementById("lista-azioni-globali");

if (lista) {


    for (a = 0; a < ingredienti_globali.length; a++) {
        let inni = "";
        let inserisco = true;

        for (e = 0; e < ingredienti_totali.length; e++) {



            if (ingredienti_globali[a].nome.replace(/\s+/g, '') === ingredienti_totali[e].nome.replace(/\s+/g, '')) {

                inserisco = false;

            }
        }

        if (inserisco) {

            if (ingredienti_globali[a].immagine !== "") {

                inni += '<tr> <td>' + ingredienti_globali[a].nome + '</td> <td><div class="text-center"> <a href="' + ingredienti_globali[a].immagine + '" target="_blank"> visualizza immagine </a></div></td> <td><div class="text-center"><button id="' + ingredienti_globali[a].nome +
                    '" class="btn-outline-warning btn btn-sm shadow-sm moda_imm mr-3">\n\
<i class="fas fa-edit"></i></button> <button id="' + ingredienti_globali[a].nome + '_DEL" class="btn-outline-danger shadow-sm btn btn-sm delet_ing">\n\
<i class="fas fa-trash"></i></button></div></td></tr>';

            } else {

                inni += '<tr> <td>' + ingredienti_globali[a].nome + '</td> <td></td> <td><div class="text-center"><button id="' + ingredienti_globali[a].nome +
                    '_" class="btn-outline-primary shadow-sm btn btn-sm insert_imm mr-3">\n\
<i class="fas fa-plus"></i></button><button id="' + ingredienti_globali[a].nome + '_DEL" class="btn-outline-danger shadow-sm btn btn-sm delet_ing"><i class="fas fa-trash">\n\
</i></button></div></td></tr>';

            }
            lista.innerHTML += inni;
        }
    }
}

if (lista2) {
    for (a = 0; a < azioni_globali.length; a++) {
        let inni2 = "";
        let inserisco2 = true;

        for (e = 0; e < azioni.length; e++) {

            if (azioni_globali[a].nome.replace(/\s+/g, '') === azioni[e].nome.replace(/\s+/g, '')) {

                inserisco2 = false;
            }
        }

        if (inserisco2) {
            if(azioni_globali[a].immagine !== ""){

                inni2 += '<tr> <td>' + azioni_globali[a].nome + '</td> <td><div class="text-center"> <a href="' + azioni_globali[a].immagine + '" target="_blank"> visualizza immagine </a></div></td> <td><div class="text-center"><button id="' + azioni_globali[a].nome +
                '" class="btn-outline-warning btn btn-sm shadow-sm moda_imm_az mr-3">\n\
<i class="fas fa-edit"></i></button> <button id="' + azioni_globali[a].nome + '_DEL" class="btn-outline-danger shadow-sm btn btn-sm delet_act">\n\
<i class="fas fa-trash"></i></button></div></td></tr>';

        } else {

            inni2 += '<tr> <td>' + azioni_globali[a].nome + '</td> <td></td> <td><div class="text-center"><button id="' + azioni_globali[a].nome +
                '_" class="btn-outline-primary shadow-sm btn btn-sm insert_imm_az mr-3">\n\
<i class="fas fa-plus"></i></button><button id="' + azioni_globali[a].nome + '_DEL" class="btn-outline-danger shadow-sm btn btn-sm delet_act"><i class="fas fa-trash">\n\
</i></button></div></td></tr>';
            }

            lista2.innerHTML += inni2;
        }
    }
}

$(".insert_imm").click(function (evt) {
    let ins_imm = true;
    $('#insert_immagine').modal({
        show: true,
        backdrop: 'static',
        keyboard: false
    });
    var nome_glob = $(this).attr("id").split("_")[0];

    $("#salva_insert_link_imm").click(function (ev) {
        if (ins_imm === true) {
            let insero = {cosa:"ingrediente", nome: nome_glob, immagine: $("#link_immagine").val() };
            for (b = 0; b < ingredienti_globali.length; b++) {

                if (ingredienti_globali[b].nome === nome_glob) {

                    ingredienti_globali[b].immagine = $("#link_immagine").val();
                }
            }
            sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));
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
            ins_imm = false;
            $("#link_immagine").val("");
        }
    });

    $("#annulla_insert_link_imm").click(function (ev) {
        ins_imm = false;
        $("#link_immagine").val("");
    });
    $(".close").click(function (evw) {
        ins_imm = false;
        $("#link_immagine").val("");
    });
});

$(".moda_imm").click(function (evt) {
    let ins_imm = true;
    let imma;
    var nome_glob = $(this).attr("id");
    for (b = 0; b < ingredienti_globali.length; b++) {

        if (ingredienti_globali[b].nome === nome_glob) {

            imma = ingredienti_globali[b].immagine;
        }
    }

    $('#moda_immagine').modal({
        show: true,
        backdrop: 'static',
        keyboard: false
    });

    $("#link_immagine_mod").val(imma);

    $("#salva_moda_link_imm").click(function (ev) {
        if (ins_imm === true) {
            let insero = {cosa:"ingrediente", nome: nome_glob, immagine: $("#link_immagine_mod").val() };
            for (b = 0; b < ingredienti_globali.length; b++) {

                if (ingredienti_globali[b].nome === nome_glob) {

                    ingredienti_globali[b].immagine = $("#link_immagine_mod").val();
                }
            }
            sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));
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
            ins_imm = false;
            $("#link_immagine_mod").val("");
        }
    });

    $("#annulla_moda_link_imm").click(function (ev) {
        ins_imm = false;
        $("#link_immagine_mod").val("");
    });
    $(".close").click(function (evw) {
        ins_imm = false;
        $("#link_immagine_mod").val("");
    });
});

$(".delet_ing").click(function (evt) {
    let del_imm = true;
    $('#del_element').modal({
        show: true,
        backdrop: 'static',
        keyboard: false
    });
    var nome_glob = $(this).attr("id").split("_")[0];

    $("#salva_del_element").click(function (ev) {
        if (del_imm === true) {
            for (d = 0; d < ingredienti_globali.length; d++) {

                if (nome_glob.replace(/\s+/g, '') === ingredienti_globali[d].nome.replace(/\s+/g, '')) {

                    let elimin_ing = { ing_da_eliminar: ingredienti_globali[d].nome, imma_da_eliminar: ingredienti_globali[d].immagine };
                    $.ajax({
                        url: 'elimina_ingrediente_globale.php',
                        type: 'POST',
                        async: false,
                        data: elimin_ing,
                        success: function () {
                            location.reload();
                        },
                        error: function () {
                            alert("qualcosa è andato storto");
                        }
                    });
                    ingredienti_globali.splice(d, 1);
                }
            }
            sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));
            del_imm = false;
        }
    });

    $("#annulla_del_element").click(function (ev) {
        del_imm = false;
    });
    $(".close").click(function (evw) {
        del_imm = false;
    });
});

$(".delet_act").click(function (evt) {
    let del_act = true;
    $('#del_element_act').modal({
        show: true,
        backdrop: 'static',
        keyboard: false
    });
    var nome_glob = $(this).attr("id").split("_")[0];

    $("#salva_del_element_act").click(function (ev) {
        if (del_act === true) {
            for (d = 0; d < azioni_globali.length; d++) {

                if (nome_glob.replace(/\s+/g, '') === azioni_globali[d].nome.replace(/\s+/g, '')) {

                    let elimin_act = { act_da_eliminar: azioni_globali[d].nome };
                    $.ajax({
                        url: 'elimina_azione_globale.php',
                        type: 'POST',
                        async: false,
                        data: elimin_act,
                        success: function () {
                            location.reload();
                        },
                        error: function () {
                            alert("qualcosa è andato storto");
                        }
                    });
                    azioni_globali.splice(d, 1);
                }
            }
            sessionStorage.setItem("azioni_global", JSON.stringify(azioni_globali));
            del_act = false;
        }
    });

    $("#annulla_del_element_act").click(function (ev) {
        del_act = false;
    });
    $(".close").click(function (evw) {
        del_act = false;
    });
});

$(".insert_imm_az").click(function (evt) {
    let ins_imm2 = true;
    $('#insert_immagine_azione').modal({
        show: true,
        backdrop: 'static',
        keyboard: false
    });
    var nome_glob = $(this).attr("id").split("_")[0];

    $("#salva_insert_link_imm_azione").click(function (ev) {
        if (ins_imm2 === true) {
            let insero = {cosa:"azione", nome: nome_glob, immagine: $("#link_immagine_azione").val() };
            for (b = 0; b < azioni_globali.length; b++) {

                if (azioni_globali[b].nome === nome_glob) {

                    azioni_globali[b].immagine = $("#link_immagine_azione").val();
                }
            }
            sessionStorage.setItem("azioni_global", JSON.stringify(azioni_globali));
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
            ins_imm2 = false;
            $("#link_immagine_azione").val("");
        }
    });

    $("#annulla_insert_link_imm_azione").click(function (ev) {
        ins_imm2 = false;
        $("#link_immagine_azione").val("");
    });
    $(".close").click(function (evw) {
        ins_imm2 = false;
        $("#link_immagine_azione").val("");
    });
});

$(".moda_imm_az").click(function (evt) {
    let ins_imm2 = true;
    let imma2;
    var nome_glob = $(this).attr("id");
    for (b = 0; b < azioni_globali.length; b++) {

        if (azioni_globali[b].nome === nome_glob) {

            imma2 = azioni_globali[b].immagine;
        }
    }

    $('#moda_immagine_azione').modal({
        show: true,
        backdrop: 'static',
        keyboard: false
    });

    $("#link_immagine_mod_azione").val(imma2);

    $("#salva_moda_link_imm_azione").click(function (ev) {
        if (ins_imm2 === true) {
            let insero = {cosa:"azione", nome: nome_glob, immagine: $("#link_immagine_mod_azione").val() };
            for (b = 0; b < azioni_globali.length; b++) {

                if (azioni_globali[b].nome === nome_glob) {

                    azioni_globali[b].immagine = $("#link_immagine_mod_azione").val();
                }
            }
            sessionStorage.setItem("azioni_global", JSON.stringify(azioni_globali));
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
            ins_imm2 = false;
            $("#link_immagine_mod_azione").val("");
        }
    });

    $("#annulla_moda_link_imm_azione").click(function (ev) {
        ins_imm2 = false;
        $("#link_immagine_mod_azione").val("");
    });
    $(".close").click(function (evw) {
        ins_imm2 = false;
        $("#link_immagine_mod_azione").val("");
    });
});