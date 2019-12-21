// *** inizio istanziamento varibili di supporto //
var
    svg = document.getElementById('vedo'),
    g = document.getElementById("vedo2"),
    muovilo,
    crealo,
    toppe,
    lefte,
    inn,
    nodo_source = "",
    tipologia_nodo_source = "",
    tipologia_nodo_target = "",
    nodo_target = "",
    muovo,
    eliminabile;
// fine variabili di supporto *** //  


// *** inizio creazione funzioni di supporto //

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

// funzione che mi restituisce true se un link già esiste
function esiste(idsource, idtarget) {
    let bool = false;
    for (i = 0; i < link.length; i++) {
        if (link[i].source === idsource && link[i].target === idtarget) {
            bool = true;
        }
    }
    return bool;
}

// funzione che mi restituisce un json-format delle info riguardanti l'id dell'ingrediente inserito
function info_ingrediente(idingrediente) {
    for (i = 0; i < ingredienti_totali.length; i++) {
        if (ingredienti_totali[i].id === idingrediente) {
            info = { ricetta: sessionStorage.getItem("nome_file"), id: idingrediente, nome: ingredienti_totali[i].nome, quantita: ingredienti_totali[i].quantita }
        }
    }
    return info;
}

// questa funzione servrà per restituirmi il punto del mio SVG 
// in cui il mio mouse è puntato
function svgPoint(element, x, y) {
    var
    pt = element.createSVGPoint();
    pt.x = x;
    pt.y = y;
    return pt.matrixTransform(g.getScreenCTM().inverse());
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

                    let elimin_act = { act_da_eliminar: azioni_globali[h].nome };
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
// fine funzioni di suporto *** //


$("#vedo").on('contextmenu', function (e) {
     
    toppe = e.pageY;
    lefte = e.pageX;

    var target = $(e.target);

    if (target.is("circle") || target.is("rect") || target.is("line")) {

        eliminabile = target[0];

        if ($("#context-menu-inserisci").hasClass("show")) {

            $("#context-menu-inserisci").removeClass("show").hide();
            inn = false;

        }

        $("#context-menu-cancella").css({
            display: "block",
            top: toppe,
            left: lefte
        }).addClass("show");

    }
    else {

        inn = true;

        if ($("#context-menu-cancella").hasClass("show")) {

            $("#context-menu-cancella").removeClass("show").hide();

        }

        $("#context-menu-inserisci").css({
            display: "block",
            top: toppe,
            left: lefte
        }).addClass("show");

    }
    return false; //blocks default Webbrowser right click menu
}).on("click", function () {
    if (inn) {

        $("#context-menu-inserisci").removeClass("show").hide();
        inn = false;

    } else {

        $("#context-menu-cancella").removeClass("show").hide();

    }
});

$("#context-menu-cancella a").on("click", function () {
    $(this).parent().removeClass("show").hide();
});

$("#context-menu-inserisci a").on("click", function () {
    $(this).parent().removeClass("show").hide();
    inn = false;
});


// questa funzione mi permette di creare oggetti cioè cerchi o rettangoli
// cioè ingredienti o azioni nel mio grafico SVG
$(".inse").click(function (evt) {


    // questa variabile mi permette di identificare il target dell'evento
    var target = $(evt.target);
    
    let cosas = target[0].getAttribute("id");

        // questa variabile mi permette di non avere problemi quando non arrivo a terminare la sequenza di inserimento
        let scrivi = true;

        //attivo il modal che conterrà il form con le info per inserire l'ingrediente
        $('#insert_ingrediente').modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });

        // queste variabili servono per identificare le liste degli ingredienti globali
        var lista = document.getElementById("globali");
        var lista2 = document.getElementById("act_globali");

        // questo ciclo serve ad inserire le opzioni per l'inserimento del nome dell'ingrediente
        for (a = 0; a < ingredienti_globali.length; a++) {
            let puoi = true;
            for (x = 0; x < ingredienti_totali.length; x++) {

                if (puoi && ingredienti_globali[a].nome.replace(/\s+/g, '') === ingredienti_totali[x].nome.replace(/\s+/g, '')) {

                    puoi = false;

                }
            }
            if (puoi) {

                let inni = "<option value='" + ingredienti_globali[a].nome + "'>" + ingredienti_globali[a].nome + "</option>";
                lista.innerHTML += inni;

            }
        }

        // questo ciclo serve ad inserire le opzioni per l'inserimento del nome delle azioni
        for (a = 0; a < azioni_globali.length; a++) {
            let puoi = true;
            for (x = 0; x < azioni.length; x++) {

                if (puoi && azioni_globali[a].nome.replace(/\s+/g, '') === azioni[x].nome.replace(/\s+/g, '')) {

                    puoi = false;

                }
            }
            if (puoi) {

                let inni2 = "<option value='" + azioni_globali[a].nome + "'>" + azioni_globali[a].nome + "</option>";
                lista2.innerHTML += inni2;

            }
        }

        // quando devo inserire un azione allora nascondo le parti del form per l'ingrediente
        if (cosas === "inse_az") {
            $(".solo_ingrediente").hide();
            $(".solo_condizione").hide();
            $(".solo_azione").show();
        }

        // quando devo inserire un ingrediente allora nascondo le parti del form per l'azione
        if (cosas === "inse_in") {
            $(".solo_azione").hide();
            $(".solo_condizione").hide();
            $(".solo_ingrediente").show();
        }

        // quando devo inserire un azione con condizione allora nascondo le parti del form per l'ingrediente
        if(cosas === "inse_az_con"){
            $(".solo_ingrediente").hide();
            $(".solo_azione").show();
            $(".solo_condizione").show();
        }

        // questo evento mi cattura il clik sul bottone per l'inserimento
        $("#salva_inserimento").click(function (ev) {

            // richiamo la variabile iniziale per essere sicuro di essere sempre durante la cattura dello stesso evento
            if (scrivi === true) {

                // questa serie  di variabili mi identificano gli elementi del form
                let nome = document.getElementById("nome_nodo");
                let quant = document.getElementById("quantita_nodo");
                let imma = document.getElementById("immagine_nodo");
                let nome_azione = document.getElementById("nome_nodo2");
                let durata = document.getElementById("durata_nodo");
                let condizione = document.getElementById("condizione_nodo");

                // questa e varibili mi servono per identificare il punto cliccato, 
                // così da poter trovare il punto esatto dove inserire la figura
                var
                    x = lefte,
                    y = toppe,
                    svgP = svgPoint(svg, x, y),
                    xe = Math.round(svgP.x),
                    ye = Math.round(svgP.y);

                // faccio un controllo sull'unico elemento indispensabile per l'inserimento, cioè il nome    
                if (cosas === "inse_in") {
                    if(nome.value !== ""){

                    // questa varibile mi serve per capire se ho già questo ingredinte tra quelli globali
                    let non = true;

                    // con questo ciclo controllo tra gli ingredienti globali se l'ingrediente è già inserito o meno
                    for (n = 0; n < ingredienti_globali.length; n++) {

                        // in caso il nome dell'ingrediente locale da inserire sia uguale(senza spazi superflui) 
                        // ad un ingrediente già inserito nella lista globale
                        if (ingredienti_globali[n].nome.replace(/\s+/g, '') === nome.value.replace(/\s+/g, '')) {

                            // la variabile per l'inserimento la setto a false
                            non = false;

                            // tengo però presente il fatto di poter modificare l'immagine all'ingrediente globale
                            // anche nel caso in cui l'immagine sia già presente
                            if (imma.value !== "") {

                                // questa è la chiamata per la modifica
                                let insero = { nome: ingredienti_globali[n].nome, immagine: imma.value }
                                $.ajax({
                                    url: 'aggiungi_modifica_immagine.php',
                                    async: false,
                                    type: 'POST',
                                    data: insero,
                                    success: function () {
                                        location.reload();
                                    },
                                    error: function () {
                                        alert("qualcosa è andato storto");
                                    }
                                });

                                // aggiorno quindi anche la lista degli ingredienti globali nel caso in cui abbia cambiato l'immagine
                                ingredienti_globali[n].immagine = imma.value;
                                sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));

                            } else {

                                // nel caso in cui invece io non abbia inserito l'immagine allora prendo quella dalla lista globale
                                imma.value = ingredienti_globali[n].immagine
                            }
                        }
                    }

                    // nel caso in cui invece l'ingrediente locale inserito non sia presente nella lista globale allora devo inserirlo
                    if (non) {

                        // mi serve il solito json-format dell'ingrediente globale da inserire
                        vara_glob = { nome: nome.value, immagine: imma.value };

                        //lo inserisco dentro la lista globale
                        ingredienti_globali.push(vara_glob);

                        // infine aggiorno anche la variabile nella cache che è quella che mi interessa veramente
                        sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));

                        // chiamata per l'inserimento nel file json
                        $.ajax({
                            url: 'aggiungi_ingrediente_globale.php',
                            async: false,
                            type: 'POST',
                            data: vara_glob
                        });
                    }

                    // finito di gestire la lista globale rispetto alla locale inizio con l'inserimento nel file xml
                    // la prima variabile da cercare è l'id nuovo che sarà di un punto superiore all'id più grande
                    let idi = cerca_ultimo_id_ingredienti();

                    // questo json-format mi serve per inserire l'ingrediente nella lista degli ingredienti locali
                    let inse = {
                        id: idi,
                        nome: nome.value,
                        quantita: quant.value,
                        immagine: imma.value
                    };

                    // inserisco infine nella lista
                    ingredienti_totali.push(inse);

                    // questo json-format mi serve per inserire l'ingrediente nel file xml
                    let inse2 = {
                        ricetta: sessionStorage.getItem("nome_file"),
                        id: idi,
                        nome: nome.value,
                        quantita: quant.value
                    };

                    // creo l'oggetto da inserire nel grafico
                    crea_oggetto(idi, xe, ye);

                    // eseguo la chiamata per inserire l'ingrediente nel file xml
                    $.ajax({
                        url: 'inserimento_ingrediente.php',
                        async: false,
                        type: 'POST',
                        data: inse2
                    });

                    // alla fine dell'inserimento chiudo l'evento mettendo scrivi a false e impedendo la scrittura futura
                    // ho il problema che non inserendo questa variabile mi esegua una scrittuare nel caso in cui non concluda la procedura
                    scrivi = false;
                }else{

                    // nel caso in cui l'utente non abbia inserito il nome dell'azione o dell'ingrediente
                    alert("serve il nome");
                    scrivi = false;

                }

                } else if (cosas === "inse_az") {
                    if (nome_azione.value !== "") {

                        // questa varibile mi serve per capire se ho già questo ingredinte tra quelli globali
                        let non = true;

                        // con questo ciclo controllo tra gli ingredienti globali se l'ingrediente è già inserito o meno
                        for (n = 0; n < azioni_globali.length; n++) {

                            // in caso il nome dell'azione locale da inserire sia uguale(senza spazi superflui) 
                            // ad un'azione già inserita nella lista globale
                            if (azioni_globali[n].nome.replace(/\s+/g, '') === nome_azione.value.replace(/\s+/g, '')) {

                                // la variabile per l'inserimento la setto a false
                                non = false;
                            }
                        }

                        // nel caso in cui invece l'azione locale inserito non sia presente nella lista globale allora devo inserirla
                        if (non) {

                            // mi serve il solito json-format dell'azione globale da inserire
                            vara_glob = { nome: nome_azione.value };

                            //lo inserisco dentro la lista globale
                            azioni_globali.push(vara_glob);

                            // infine aggiorno anche la variabile nella cache che è quella che mi interessa veramente
                            sessionStorage.setItem("azioni_global", JSON.stringify(azioni_globali));

                            // chiamata per l'inserimento nel file json
                            $.ajax({
                                url: 'aggiungi_azione_globale.php',
                                async: false,
                                type: 'POST',
                                data: vara_glob
                            });
                        }
                        // prendo in esame infine il caso dell'inserimento dell'azione
                        // come prime devo cercare l'id più uno rispetto all'ultimo id delle azioni
                        let idi = cerca_ultimo_id_azioni();

                        let inse = {
                            id: idi,
                            nome: nome_azione.value,
                            durata: durata.value,
                            condizione: ""
                        };

                        // inserisco infine nella lista
                        azioni.push(inse);

                        // questo json- format mi serve per inserire l'azione nel fil xml
                        let inse2 = {
                            ricetta: sessionStorage.getItem("nome_file"),
                            id: idi,
                            nome: nome_azione.value,
                            durata: durata.value,
                            condizione: ""
                        };

                        // creo l'oggetto da inserire nel grafico
                        crea_oggetto(idi, xe, ye);

                        // eseguo la chiamata per l'inserimento dell'azione nel file xml
                        $.ajax({
                            url: 'inserimento_azione.php',
                            async: false,
                            type: 'POST',
                            data: inse2
                        });

                        // alla fine dell'inserimento chiudo l'evento mettendo scrivi a false e impedendo la scrittura futura
                        // ho il problema che non inserendo questa variabile mi esegua una scrittuare nel caso in cui non concluda la procedura
                        scrivi = false;
                    } else {

                        // nel caso in cui l'utente non abbia inserito il nome dell'azione o dell'ingrediente
                        alert("serve il nome");
                        scrivi = false;
                    }
                } else if(cosas === "inse_az_con"){

                    if (nome_azione.value !== "" && condizione.value !== "") {

                        // questa varibile mi serve per capire se ho già questo ingredinte tra quelli globali
                        let non = true;

                        // con questo ciclo controllo tra gli ingredienti globali se l'ingrediente è già inserito o meno
                        for (n = 0; n < azioni_globali.length; n++) {

                            // in caso il nome dell'azione locale da inserire sia uguale(senza spazi superflui) 
                            // ad un'azione già inserita nella lista globale
                            if (azioni_globali[n].nome.replace(/\s+/g, '') === nome_azione.value.replace(/\s+/g, '')) {

                                // la variabile per l'inserimento la setto a false
                                non = false;
                            }
                        }

                        // nel caso in cui invece l'azione locale inserito non sia presente nella lista globale allora devo inserirla
                        if (non) {

                            // mi serve il solito json-format dell'azione globale da inserire
                            vara_glob = { nome: nome_azione.value };

                            //lo inserisco dentro la lista globale
                            azioni_globali.push(vara_glob);

                            // infine aggiorno anche la variabile nella cache che è quella che mi interessa veramente
                            sessionStorage.setItem("azioni_global", JSON.stringify(azioni_globali));

                            // chiamata per l'inserimento nel file json
                            $.ajax({
                                url: 'aggiungi_azione_globale.php',
                                async: false,
                                type: 'POST',
                                data: vara_glob
                            });
                        }
                        // prendo in esame infine il caso dell'inserimento dell'azione
                        // come prime devo cercare l'id più uno rispetto all'ultimo id delle azioni
                        let idi = cerca_ultimo_id_azioni();

                        let inse = {
                            id: idi,
                            nome: nome_azione.value,
                            durata: durata.value,
                            condizione: condizione.value
                        };

                        // inserisco infine nella lista
                        azioni.push(inse);

                        // questo json- format mi serve per inserire l'azione nel fil xml
                        let inse2 = {
                            ricetta: sessionStorage.getItem("nome_file"),
                            id: idi,
                            nome: nome_azione.value,
                            durata: durata.value,
                            condizione: condizione.value
                        };

                        // creo l'oggetto da inserire nel grafico
                        crea_oggetto(idi, xe, ye);

                        // eseguo la chiamata per l'inserimento dell'azione nel file xml
                        $.ajax({
                            url: 'inserimento_azione_condizione.php',
                            async: false,
                            type: 'POST',
                            data: inse2
                        });

                        // alla fine dell'inserimento chiudo l'evento mettendo scrivi a false e impedendo la scrittura futura
                        // ho il problema che non inserendo questa variabile mi esegua una scrittuare nel caso in cui non concluda la procedura
                        scrivi = false;
                    } else {

                        // nel caso in cui l'utente non abbia inserito il nome dell'azione o dell'ingrediente
                        alert("serve il nome");
                        scrivi = false;
                    }
                }
            }

            // questo mi serve perchè andava in conflitto il popover di bootstrap
            $('circle').popover({
                trigger: 'hover'
            });
            $('rect').popover({
                trigger: 'hover'
            });
        });

        // se annullo l'inserimento devo settare la variabile dell'evento a false
        $("#annulla_insertnodo").click(function (ev) {
            scrivi = false;

        });

        // stessa cosa di prima
        $(".close").click(function (evw) {
            scrivi = false;

        });
});


// questa funzione mi permette di creare link
$("#vedo").mousedown(function (evt) {
    if(evt.which === 1){

        // a questo punto devo controllare quale elemento del mio grafico sia stato selezionato
        var target = $(evt.target);

        // se il mio elemento è un nodo ingrediente o azione
        if (target.attr('class') === "oggetto" && (target.is("circle") || target.is("rect"))) {

            // disabilito il panneling per far muovere la freccia del link
            grafico.disablePan();

            // salvo l'id del nodo che ho selezionato da cui faccio partire la freccia            
            nodo_source = target.attr("id");

            // devo cambiare la classe dei miei oggetti per poter permettere di collegarli
            kids = $("#vedo2").children("rect,circle");

            // queste invece sono le mie variabili per la posizione da cui far partire la freccia
            var
            x = 0,
            y = 0;

            // nascondo le sezioni che compaiono con le info dei nodi
            $(evt.target).popover("hide");

            // setto le variabili da controllare dopo per validare la creazione del link
            muovilo = true;
            crealo = true;

            // se il nodo selezionato è un ingrediente (un cerchio)
            if (target.is("circle")) {

                // setto la mia variabile per la tipologia del nodo di partenza del link
                tipologia_nodo_source = "ingrediente";

                // infine setto le variabili per la posizione iniziale del mio link
                x = target.attr("cx");
                y = target.attr("cy");

                // se invece è un azione
            } else if (target.is("rect")) {

                // setto la mia variabile per la tipologia del nodo di partenza del link
                tipologia_nodo_source = "azione";

                // infine setto le variabili per la posizione iniziale del mio link
                x = target.attr("x");
                y = target.attr("y");
            }

            // alla fine cambio la classe di tutti gli oggetti per permettere
            // successivamente di essere linkabili
            kids.removeClass("oggetto");
            kids.addClass("oggetto2");

            // creo come ultimo oggetto il mio link
            crea_link((nodo_source + "_"), x, y);
        }

        // se invece il mio elemento selezionato è un link già esistente da dover modificare 
        if (target.is("line") && target.attr('class') !== "oggetto") {

            // disabilito come prima il panneling
            grafico.disablePan();

            // setto la mia variabile che mi servirà per identificare il link da spostare
            da_muovere = target.attr("id");

            // setto la mia variabile del nodo da cui parte il link
            nodo_source = target.attr("id").split("_")[0];

            // setto la variabile che mi dice che tipo di nodo è
            if (nodo_source.includes("i")) {
                tipologia_nodo_source = "ingrediente";
            } else {
                tipologia_nodo_source = "azione";
            }

            // salvo le variabili con le coordinate finali nel caso in cui non vada in porto la modifica
            coordinata_prima_x = target.attr("x2");
            coordinata_prima_y = target.attr("y2");

            // anche qui devo rendere tutti nodi linkabili
            kids = $("#vedo2").children("rect,circle");
            
            // setto le mie variabili per validare la modifica del link successivamente
            muovilo = true;
            crealo = false;

            // infine cambio la classe di tutti i miei nodi per renderli linkabili
            kids.removeClass("oggetto");
            kids.addClass("oggetto2");
        }

        muovo = true;
    

    }
});

// questa funzione mi permette di muovere il link create con lp'azione precedente
$("#vedo").mousemove(function (er) {
    if(muovo){
        // se mi trovo nello stato in cui ho la certezza che posso procedere
        if (muovilo) {

            // ad ogni movimento ricalcolo la posizione di termine del mio link
            // settando le variabili di posizionamento finale con il posizionamento
            // del mio mouse e infine ricalcolando il tutto rispetto alla matrice 
            // di alterazione del mio svg
            var
            x = er.clientX,
            y = er.clientY,
            svgP = svgPoint(svg, x, y);

            //  se devo creare da zero un link allora 
            if (crealo) {

                // il mio link fisico sarà quello con id nodo_source_
                linea = document.getElementById(nodo_source + "_");

                // se invece devo muoverne uno già esistente 
            } else if(!crealo){

                // dovrò prendere l id di quello esistente
                linea = document.getElementById(da_muovere);
            }

            // a questo punto definito il link fisico da muovere lo faccio muovere con le regole che seguono
            x1 = linea.getAttribute("x1");
            y1 = linea.getAttribute("y1");
            if (svgP.x - x1 > 0 && svgP.y - y1 > 0) {
                linea.setAttribute("x2", Math.round(svgP.x) - 50);
                linea.setAttribute("y2", Math.round(svgP.y) - 50);
            } else if (svgP.x - x1 > 0 && svgP.y - y1 < 0) {
                linea.setAttribute("x2", Math.round(svgP.x) - 50);
                linea.setAttribute("y2", Math.round(svgP.y) + 50);
            } else if (svgP.x - x1 < 0 && svgP.y - y1 > 0) {
                linea.setAttribute("x2", Math.round(svgP.x) + 50);
                linea.setAttribute("y2", Math.round(svgP.y) - 50);
            } else if (svgP.x - x1 === 0 && svgP.y - y1 > 0) {
                linea.setAttribute("x2", Math.round(svgP.x));
                linea.setAttribute("y2", Math.round(svgP.y) - 50);
            } else if (svgP.x - x1 < 0 && svgP.y - y1 === 0) {
                linea.setAttribute("x2", Math.round(svgP.x) + 50);
                linea.setAttribute("y2", Math.round(svgP.y));
            } else if (svgP.x - x1 === 0 && svgP.y - y1 < 0) {
                linea.setAttribute("x2", Math.round(svgP.x));
                linea.setAttribute("y2", Math.round(svgP.y) + 50);
            } else if (svgP.x - x1 > 0 && svgP.y - y1 === 0) {
                linea.setAttribute("x2", Math.round(svgP.x) - 50);
                linea.setAttribute("y2", Math.round(svgP.y));
            } else if (svgP.x - x1 < 0 && svgP.y - y1 < 0) {
                linea.setAttribute("x2", Math.round(svgP.x) + 50);
                linea.setAttribute("y2", Math.round(svgP.y) + 50);
            }
        }
    }
});

// questa azione invece mi permette di stabilire quale sia il target del mio link
$("#vedo").mouseup(function (e) {
    if(muovo){

    
        grafico.enablePan();

        $('rect').popover({
            trigger: 'hover'
        });
        $('[data-toggle="popover"]').popover("enable");

        // se posso validarlo
        if (muovilo) {

            // questa variabile mi serve per capire se sto collegando due ingredienti
            var ingre_ingre = false;

            // questa variabile mi serve per riportare la classe oggetto al posto della classe  oggetto2
            var
            kidse = $("#vedo2").children("rect,circle"),

            // questa invece mi serve per sapere su quale oggetto mi trovo da collegare
            target2 = $(e.target);

            //  se devo creare da zero un link allora 
            if (crealo) {

                // il mio link fisico sarà quello con id nodo_source_
                linea = document.getElementById(nodo_source + "_");

                // se invece devo muoverne uno già esistente 
            } else if(!crealo){

                // dovrò prendere l id di quello esistente
                linea = document.getElementById(da_muovere);
            }

            // queste due variabili conterranno la posizione finale del mio link
            x = 0,
            y = 0;

            // questa conterrà l id del mio target
            let nodo_target = target2.attr("id");

            // controllo se questo link non esista già
            esiste_gia = esiste(nodo_source, nodo_target);

            // a questo punto se target ha classe oggetto 2
            if (target2.attr('class') === "oggetto2") {
                // e se il collegamento non esiste già
                if (!esiste_gia) {

                    // controllo che tipo di target sia, nel caso sia un ingrediente
                    if (target2.is("circle")) {

                        // dovrò prendere come posizione finale queste due variabili
                        x = target2.attr("cx");
                        y = target2.attr("cy");

                        // se il nodo da collegare all'ingrediente è un azione
                        if (tipologia_nodo_source === "azione") {

                            // se è un link già esistente
                            if (!crealo) {

                                // mi serve l id dei due nodi già collegati
                                let splitto = da_muovere.split("_");
                                let id1 = splitto[0];
                                let id2 = splitto[1];

                                if (id1.includes("a", 1) && id2.includes("a", 1)) {
                                    let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id1, target: id2 };
                                    $.ajax({
                                        url: 'cancella_relazione_ordine.php',
                                        type: 'POST',
                                        async: false,
                                        data: dati
                                    });

                                } else if (id1.includes("a", 1) && id2.includes("i", 1)) {
                                    let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id2, target: id1 };
                                    $.ajax({
                                        url: 'cancella_post.php',
                                        type: 'POST',
                                        async: false,
                                        data: dati
                                    });

                                } else if (id1.includes("i", 1) && id2.includes("a", 1)) {
                                    let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id1, target: id2 };
                                    $.ajax({
                                        url: 'cancella_pre.php',
                                        type: 'POST',
                                        async: false,
                                        data: dati
                                    });
                                }
                            }

                            let inf = info_ingrediente(nodo_target);
                            let dati = { ricetta: sessionStorage.getItem("nome_file"), idazione: nodo_source, idingrediente: nodo_target, nomeingrediente: inf.nome, quantita: inf.quantita };
                            $.ajax({
                                url: 'inserimento_post.php',
                                type: 'POST',
                                async: false,
                                data: dati
                            });
                        } else {
                            ingre_ingre = true;
                            alert("non è possibile");
                            linea.remove();
                            delete linea;
                        }
                        tipologia_nodo_target = "ingrediente";
                    } else if (target2.is("rect")) {

                        if (!crealo) {

                            let splitto = da_muovere.split("_");
                            let id1 = splitto[0];
                            let id2 = splitto[1];

                            if (id1.includes("a", 1) && id2.includes("a", 1)) {
                                let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id1, target: id2 };
                                $.ajax({
                                    url: 'cancella_relazione_ordine.php',
                                    type: 'POST',
                                    async: false,
                                    data: dati
                                });

                            } else if (id1.includes("a", 1) && id2.includes("i", 1)) {
                                let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id2, target: id1 };
                                $.ajax({
                                    url: 'cancella_post.php',
                                    type: 'POST',
                                    async: false,
                                    data: dati
                                });

                            } else if (id1.includes("i", 1) && id2.includes("a", 1)) {
                                let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id1, target: id2 };
                                $.ajax({
                                    url: 'cancella_pre.php',
                                    type: 'POST',
                                    async: false,
                                    data: dati
                                });
                            }
                        }

                        tipologia_nodo_target = "azione";
                        x = target2.attr("x");
                        y = target2.attr("y");
                        if (tipologia_nodo_source === "azione") {
                            esiste_contrario = esiste(nodo_target, nodo_source);
                            if (esiste_contrario) {
                                let da_condizione = false;
                                for(y = 0; y < azioni.length; y++){

                                    if(azioni[y].id === nodo_source){

                                        if(azioni[y].condizione !== ""){

                                            da_condizione = true;

                                        }
                                    }
                                }
                                if(da_condizione){
                                    console.log("parto da una condizione");

                                $.ajax({
                                    url: 'inserimento_relazione_simul.php',
                                    type: 'POST',
                                    async: false,
                                    data: { ricetta: sessionStorage.getItem("nome_file"), source: nodo_source, target: nodo_target }
                                });
                                $.ajax({
                                    url: 'cancella_relazione_ordine.php',
                                    type: 'POST',
                                    async: false,
                                    data: { ricetta: sessionStorage.getItem("nome_file"), source: nodo_target, target: nodo_source },
                                    success: function () {
                                        location.reload();
                                    },
                                    error: function () {
                                        alert("qualcosa è andato storto");
                                    }
                                });

                                }else{

                                $.ajax({
                                    url: 'inserimento_relazione_simul.php',
                                    type: 'POST',
                                    async: false,
                                    data: { ricetta: sessionStorage.getItem("nome_file"), source: nodo_target, target: nodo_source }
                                });
                                $.ajax({
                                    url: 'cancella_relazione_ordine.php',
                                    type: 'POST',
                                    async: false,
                                    data: { ricetta: sessionStorage.getItem("nome_file"), source: nodo_source, target: nodo_target },
                                    success: function () {
                                        location.reload();
                                    },
                                    error: function () {
                                        alert("qualcosa è andato storto");
                                    }
                                });

                                }
                            } else {
                                let linki = { ricetta: sessionStorage.getItem("nome_file"), source: nodo_source, target: nodo_target };
                                $.ajax({
                                    url: 'inserimento_relazione_ordine.php',
                                    type: 'POST',
                                    async: false,
                                    data: linki
                                });
                            }
                        } else if (tipologia_nodo_source === "ingrediente") {

                            let inf = info_ingrediente(nodo_source);
                            let dati = { ricetta: sessionStorage.getItem("nome_file"), idazione: nodo_target, idingrediente: nodo_source, nomeingrediente: inf.nome, quantita: inf.quantita };
                            $.ajax({
                                url: 'inserimento_pre.php',
                                type: 'POST',
                                async: false,
                                data: dati
                            });
                        }
                    }
                    if (!ingre_ingre) {

                        let pos_ini_y = parseInt(linea.getAttribute("y1"));
                        let pos_ini_x = parseInt(linea.getAttribute("x1"));
                        let pos_fin_y = parseInt(y);
                        let pos_fin_x = parseInt(x);
                        let azione = false;
                        if (tipologia_nodo_target === "azione") {

                            azione = true;

                        }

                        if (tipologia_nodo_source === "ingrediente") {
                            if (pos_ini_y === pos_fin_y && pos_ini_x > pos_fin_x) {
                                pos_fin_x = (pos_fin_x + 65);
                            } else if (pos_ini_y === pos_fin_y && pos_ini_x < pos_fin_x) {
                                pos_fin_x = (pos_fin_x - 65);
                            } else if (pos_ini_y < pos_fin_y && pos_ini_x < pos_fin_x) {
                                pos_fin_x = (pos_fin_x - 35);
                            } else if (pos_ini_y < pos_fin_y && pos_ini_x === pos_fin_x) {
                                pos_fin_y = (pos_fin_y - 65);
                            } else if (pos_ini_y < pos_fin_y && pos_ini_x > pos_fin_x) {
                                pos_fin_x = (pos_fin_x + 45);
                                pos_fin_y = (pos_fin_y - 35);
                            } else if (pos_ini_y > pos_fin_y && pos_ini_x < pos_fin_x) {
                                pos_fin_x = (pos_fin_x - 45);
                                pos_fin_y = (pos_fin_y + 35);
                            } else if (pos_ini_y > pos_fin_y && pos_ini_x === pos_fin_x) {
                                pos_fin_y = (pos_fin_y + 65);
                            } else if (pos_ini_y > pos_fin_y && pos_ini_x > pos_fin_x) {
                                pos_fin_x = (pos_fin_x + 55);
                                pos_fin_y = (pos_fin_y + 35);
                            }
                        } else {
                            if (pos_ini_y === pos_fin_y && pos_ini_x > pos_fin_x && !azione) {
                                pos_fin_x = (pos_fin_x - 75);
                            } else if (pos_ini_y === pos_fin_y && pos_ini_x > pos_fin_x && azione) {
                                pos_fin_x = (pos_fin_x + 25);
                                pos_fin_y = (pos_fin_y - 45);
                            } else if (pos_ini_y === pos_fin_y && pos_ini_x < pos_fin_x && azione) {
                                pos_fin_x = (pos_fin_x - 65);
                            } else if (pos_ini_y === pos_fin_y && pos_ini_x < pos_fin_x && !azione) {
                                pos_fin_x = (pos_fin_x - 65);
                                pos_fin_y = (pos_fin_y - 35);
                            } else if (pos_ini_y < pos_fin_y && pos_ini_x < pos_fin_x) {
                                pos_fin_x = (pos_fin_x - 45);
                                pos_fin_y = (pos_fin_y - 35);
                            } else if (pos_ini_y < pos_fin_y && pos_ini_x === pos_fin_x) {
                                pos_fin_y = (pos_fin_y - 65);
                            } else if (pos_ini_y < pos_fin_y && pos_ini_x > pos_fin_x) {
                                pos_fin_x = (pos_fin_x + 45);
                                pos_fin_y = (pos_fin_y - 35);
                            } else if (pos_ini_y > pos_fin_y && pos_ini_x < pos_fin_x) {
                                pos_fin_x = (pos_fin_x - 45);
                                pos_fin_y = (pos_fin_y + 35);
                            } else if (pos_ini_y > pos_fin_y && pos_ini_x === pos_fin_x) {
                                pos_fin_y = (pos_fin_y + 65);
                            } else if (pos_ini_y > pos_fin_y && pos_ini_x > pos_fin_x) {
                                pos_fin_x = (pos_fin_x + 55);
                                pos_fin_y = (pos_fin_y + 35);
                            }
                        }

                        linea.setAttribute("x2", pos_fin_x);
                        linea.setAttribute("y2", pos_fin_y);

                        linea.setAttribute("id", nodo_source + "_" + nodo_target);
                        let inse = { source: nodo_source, target: nodo_target };
                        link.push(inse);
                        if(!crealo){

                            cerca_ed_elimina(da_muovere);
                        }
                    }

                } else {
                    alert("esiste già");
                    if (!crealo) {

                        linea.setAttribute("x2", coordinata_prima_x);
                        linea.setAttribute("y2", coordinata_prima_y);

                    } else {

                        linea.remove();
                        delete linea;

                    }
                }
            }
            else {
                alert("nessun collegamento possibile");
                if (!crealo) {

                    linea.setAttribute("x2", coordinata_prima_x);
                    linea.setAttribute("y2", coordinata_prima_y);

                } else {

                    linea.remove();
                    delete linea;

                }
            }

            muovilo = false;
            crealo = true;
            kidse.removeClass("oggetto2");
            kidse.addClass("oggetto");
        }
    }
    muovo = false;
    
});

// questa funzione mi permette di eliminare un elemento del mio grafico SVG
$("#ca").click(function (evt) {
    let cance = true;
    grafico = svgPanZoom(svgElement);
    var target = eliminabile;
    console.log(target.getAttribute("id"));
        
            let idi = target.getAttribute("id");
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
                    cerca_ed_elimina(target.getAttribute("id"));

                    if (target.getAttribute("id").includes("i") && !target.getAttribute("id").includes("_")) {

                        let target_del = cerca_link_target(target.getAttribute("id"));
                        let source_del = cerca_link_source(target.getAttribute("id"));
                        let lin;

                        for (i = 0; i < target_del.length; i++) {
                            lin = $("#" + target_del[i]);
                            lin.hide();
                        }
                        for (i = 0; i < source_del.length; i++) {
                            lin = $("#" + source_del[i]);
                            lin.hide();
                        }
                        let dati = { ricetta: sessionStorage.getItem("nome_file"), id2: idi };
                        $.ajax({
                            url: 'cancella_ingrediente.php',
                            type: 'POST',
                            async: false,
                            data: dati
                        });
                        target.style.display = "none";
                        cance = false;
                    }

                    if (target.getAttribute("id").includes("a") && !target.getAttribute("id").includes("_")) {

                        let target_del = cerca_link_target(target.getAttribute("id"));
                        let source_del = cerca_link_source(target.getAttribute("id"));
                        let lin;

                        for (i = 0; i < target_del.length; i++) {
                            lin = $("#" + target_del[i]);
                            lin.hide();
                        }
                        for (i = 0; i < source_del.length; i++) {
                            lin = $("#" + source_del[i]);
                            lin.hide();
                        }
                        let datie = { ricetta: sessionStorage.getItem("nome_file"), id2: idi.toString()};
                        console.log(typeof(idi));
                        $.ajax({
                            url: 'cancella_azione.php',
                            type: 'POST',
                            async: false,
                            data: datie
                        });
                        target.style.display = "none";
                        cance = false;

                    }
                    if (target.getAttribute("id").includes("_")) {
                        let splitto = target.getAttribute("id").split("_");
                        let id1 = splitto[0];
                        let id2 = splitto[1];

                        if (id1.includes("a", 1) && id2.includes("a", 1)) {
                            let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id1, target: id2 };
                            $.ajax({
                                url: 'cancella_relazione_ordine.php',
                                type: 'POST',
                                async: false,
                                data: dati
                            });
                            target.style.display = "none";

                        } else if (id1.includes("a", 1) && id2.includes("i", 1)) {
                            let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id2, target: id1 };
                            $.ajax({
                                url: 'cancella_post.php',
                                async: false,
                                type: 'POST',
                                data: dati
                            });
                            target.style.display = "none";

                        } else if (id1.includes("i", 1) && id2.includes("a", 1)) {
                            let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id1, target: id2 };
                            $.ajax({
                                url: 'cancella_pre.php',
                                type: 'POST',
                                async: false,
                                data: dati
                            });
                            target.style.display = "none";
                        }
                        cance = false;
                    }
                }
            });
            $("#annulla_eliminazione").click(function (ev) {
                cance = false;
            });
            $(".close").click(function (evw) {
                cance = false;
            });
});