// varibili di supporto
var
    svg = document.getElementById('vedo'),
    g = document.getElementById("vedo2"),
    muovilo = null;

// funzioni per cercare l'id da inserire nei nuovi ingredienti o azioni
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

function cerca_link_source(id_eliminato) {
    let ids_source = [];
    for (i = 0; i < link.length; i++) {
        if (link[i].source === id_eliminato) {
            ids_source[ids_source.length] = (link[i].source + "_" + link[i].target);
        }
    }
    for (a = 0; a < link_dopo.length; a++) {
        if (link_dopo[a].source === id_eliminato) {
            ids_source[ids_source.length] = (link_dopo[a].source + "_" + link_dopo[a].target);
        }
    }
    return ids_source;
}

function cerca_link_target(id_eliminato) {
    let ids_target = [];
    for (i = 0; i < link.length; i++) {
        if (link[i].target === id_eliminato) {
            ids_target[ids_target.length] = (link[i].source + "_" + link[i].target);
        }
    }
    for (a = 0; a < link_dopo.length; a++) {
        if (link_dopo[a].target === id_eliminato) {
            ids_target[ids_target.length] = (link_dopo[a].source + "_" + link_dopo[a].target);
        }
    }
    return ids_target;
}


function cerca_ultimo_id_azioni() {
    let massimo = 0;
    for (i = 0; i < azioni.length; i++) {
        let nuovo_id = azioni[i].id;
        let temporaneo = nuovo_id.split("i");
        if (parseInt(temporaneo[0]) > massimo) {
            massimo = parseInt(temporaneo[0]);
        }
    }
    return (massimo + 1) + "a";
}

function cerca_ed_elimina(id_da_eliminare) {
    for (a = 0; a < ingredienti_totali.length; a++) {
        if (id_da_eliminare === ingredienti_totali[a].id) {

            for (h = 0; h < ingredienti_globali.length; h++) {

                if (ingredienti_globali[h].nome.replace(/\s+/g, '') === ingredienti_totali[a].nome.replace(/\s+/g, '')) {

                    let elimin_ing = { ing_da_eliminar: ingredienti_globali[h].nome, imma_da_eliminar: ingredienti_globali[h].immagine };
                    $.ajax({
                        url: 'elimina_ingrediente_globale.php',
                        type: 'POST',
                        async: false,
                        data: elimin_ing
                    });
                    ingredienti_globali.splice(h, 1);
                }
            }
            sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));
            ingredienti_totali.splice(a, 1);
            return;

        }
    }
    for (a = 0; a < azioni.length; a++) {

        if (id_da_eliminare === azioni[a].id) {

            for (h = 0; h < azioni_globali.length; h++) {

                if (azioni_globali[h].nome.replace(/\s+/g, '') === azioni[a].nome.replace(/\s+/g, '')) {

                    let elimin_act = { act_da_eliminar: azioni_globali[h].nome};
                    $.ajax({
                        url: 'elimina_azione_globale.php',
                        type: 'POST',
                        async: false,
                        data: elimin_act
                    });
                    azioni_globali.splice(h, 1);
                }
            }
            sessionStorage.setItem("azioni_global", JSON.stringify(azioni_globali));

            azioni.splice(a, 1);
            return;

        }

    }
    for (a = 0; a < link.length; a++) {

        if (id_da_eliminare.split("_")[0] === link[a].source && id_da_eliminare.split("_")[1] === link[a].target) {

            link.splice(a, 1);
            return;

        }

    }
    for (a = 0; a < lista_inseriti.length; a++) {

        if (id_da_eliminare === lista_inseriti[a].id) {

            lista_inseriti.splice(a, 1);
            return;

        }

    }
}

// questa funzione servirà per restituirmi il punto del mio SVG 
// in cui il mio mouse è puntato
function svgPoint(element, x, y) {
    var
        pt = element.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(g.getScreenCTM().inverse());
}

var puoi_eliminare = false;

$('body').on('keydown', function (e) {

    let tasto = e.which;

    if (tasto === 68) {

        puoi_eliminare = true;

    }
});
$('body').on('keyup', function (e) {

    puoi_eliminare = false;

});

// questa funzione mi permette di eliminare un elemento del mio grafico SVG
$("#vedo").click(function (evt) {
    let cance = true;
    grafico = svgPanZoom(svgElement);
    if (puoi_eliminare) {
        var target = $(evt.target);
        if (target.is("circle") || target.is("rect") || target.is("line")) {
            let idi = target.attr("id");
            let idddi = document.getElementById("ingre_elim");
            idddi.innerHTML = "Elimina " + idi;
            $('#elimina_ingrediente').modal({
                show: true,
                backdrop: 'static',
                keyboard: false
            });
            $("#elimina_inserimento").click(function (ev) {
                ev.preventDefault();
                if (cance === true) {
                    cerca_ed_elimina(target.attr("id"));

                    if (target.is("circle")) {

                        let target_del = cerca_link_target(target.attr("id"));
                        let source_del = cerca_link_source(target.attr("id"));
                        let lin;

                        for (i = 0; i < target_del.length; i++) {
                            lin = $("#" + target_del[i]);
                            lin.hide();
                        }
                        for (i = 0; i < source_del.length; i++) {
                            lin = $("#" + source_del[i]);
                            lin.hide();
                        }
                        let dati = { ricetta: sessionStorage.getItem("nome_file"), id2: target.attr("id") };
                        $.ajax({
                            url: 'cancella_ingrediente.php',
                            type: 'POST',
                            data: dati
                        });
                        target.hide();
                        cance = false;
                    }

                    if (target.is("rect")) {

                        let target_del = cerca_link_target(target.attr("id"));
                        let source_del = cerca_link_source(target.attr("id"));
                        let lin;


                        for (i = 0; i < target_del.length; i++) {
                            lin = $("#" + target_del[i]);
                            lin.hide();
                        }
                        for (i = 0; i < source_del.length; i++) {
                            lin = $("#" + source_del[i]);
                            lin.hide();
                        }
                        let dati = { ricetta: sessionStorage.getItem("nome_file"), id2: target.attr("id") };
                        $.ajax({
                            url: 'cancella_azione.php',
                            type: 'POST',
                            data: dati
                        });
                        target.hide();
                        cance = false;

                    }
                    if (target.is("line")) {
                        let splitto = target.attr("id").split("_");
                        let id1 = splitto[0];
                        let id2 = splitto[1];

                        if (id1.includes("a", 1) && id2.includes("a", 1)) {
                            let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id1, target: id2 };
                            $.ajax({
                                url: 'cancella_relazione_ordine.php',
                                type: 'POST',
                                data: dati
                            });
                            target.hide();

                        } else if (id1.includes("a", 1) && id2.includes("i", 1)) {
                            let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id2, target: id1 };
                            $.ajax({
                                url: 'cancella_post.php',
                                type: 'POST',
                                data: dati
                            });
                            target.hide();

                        } else if (id1.includes("i", 1) && id2.includes("a", 1)) {
                            let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id1, target: id2 };
                            $.ajax({
                                url: 'cancella_pre.php',
                                type: 'POST',
                                data: dati
                            });
                            target.hide();
                        }
                        cance = false;
                    }

                    if (target.is("path")) {
                        let splitto = target.attr("id").split("_");
                        let id1 = splitto[0];
                        let id2 = splitto[1];

                    }
                }
            });
            $("#annulla_eliminazione").click(function (ev) {
                cance = false;
            });
            $(".close").click(function (evw) {
                cance = false;
            });
        }
    }
});

var inserisci = false;

$("#vedo").on('contextmenu', function (e) {
    var top = e.pageY;
    var left = e.pageX;
    var target = $(e.target);
    if (target.is("circle") || target.is("rect") || target.is("line")) {

        if($("#context-menu-inserisci").hasClass("show")){

            $("#context-menu-inserisci").removeClass("show").hide();

        }

        $("#context-menu-cancella").css({
            display: "block",
            top: top,
            left: left
        }).addClass("show");

    }
    else{

        inserisci = true;

        if($("#context-menu-cancella").hasClass("show")){

            $("#context-menu-cancella").removeClass("show").hide();

        }

        $("#context-menu-inserisci").css({
            display: "block",
            top: top,
            left: left
        }).addClass("show");

    }
    return false; //blocks default Webbrowser right click menu
}).on("click", function () {
    if(inserisci){

        $("#context-menu-inserisci").removeClass("show").hide();

    }else{

        $("#context-menu-cancella").removeClass("show").hide();

    }

});

$("#context-menu-cancella a").on("click", function () {
    $(this).parent().removeClass("show").hide();
});
$("#context-menu-inserisci a").on("click", function () {
    $(this).parent().removeClass("show").hide();
});