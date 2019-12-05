// varibili di supporto
var
    svg = document.getElementById('vedo'),
    g = document.getElementById("vedo2"),
    muovilo,
    crealo,
    zoommabile = document.getElementById("zoommaa"),
    linkabile = document.getElementById("edita"),
    inserimento_nodi = document.getElementById("insertnodi"),
    eliminabile = document.getElementById("dele");

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

// questa funzione mi permette di creare oggetti cioè cerchi o rettangoli
// cioè ingredienti o azioni nel mio grafico SVG
$("#vedo").click(function (evt) {

    // questa variabile mi permette di non avere problemi quando non arrivo a terminare la sequenza di inserimento
    let scrivi = true;

    // questa variabile mi permette di identificare il target dell'evento
    var target = $(evt.target);

    // devo controllare il check è true per l'inserimento e
    // che io non abbia cliccato per sbaglio su di un link, ingrediente o azione esistente
    if (inserimento_nodi.checked == true && !(target.is("circle")) && !(target.is("rect")) && !(target.is("line"))) {

        //attivo il modal che conterrà il form con le info per inserire l'ingrediente
        $('#insert_ingrediente').modal({
            show: true
        });

        // queste variabili servono per identificare le classi degli elementi del form
        // permettendomi all'occasione di poterli nascondere in base alle esigenze
        let azio = document.getElementById("azion");
        let ing = document.getElementById("ingred");
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
        if (azio.checked == true) {
            $(".solo_ingrediente").hide();
        }

        // quando devo inserire un ingrediente allora nascondo le parti del form per l'azione
        if (ing.checked == true) {
            $(".solo_azione").hide();
        }

        // se cambio idea allora devo catturare l'evento al click del check e nascondere l'opposto
        $("#azion").click(function (e) {
            $(".solo_ingrediente").hide();
            $(".solo_azione").show();
        });
        $("#ingred").click(function (e) {
            $(".solo_ingrediente").show();
            $(".solo_azione").hide();
        });

        // questo evento mi cattura il clik sul bottone per l'inserimento
        $("#salva_inserimento").click(function (ev) {

            // richiamo la variabile iniziale per essere sicuro di essere sempre durante la cattura dello stesso evento
            if (scrivi === true) {

                // questa serie  di variabili mi identificano gli elementi del form
                let nome = document.getElementById("nome_nodo");
                let ingredi = document.getElementById("ingred");
                let quant = document.getElementById("quantita_nodo");
                let imma = document.getElementById("immagine_nodo");
                let nome_azione = document.getElementById("nome_nodo2");
                let durata = document.getElementById("durata_nodo");

                // questa e varibili mi servono per identificare il punto cliccato, 
                // così da poter trovare il punto esatto dove inserire la figura
                var
                    x = evt.clientX,
                    y = evt.clientY,
                    svgP = svgPoint(svg, x, y),
                    xe = Math.round(svgP.x),
                    ye = Math.round(svgP.y);

                // faccio un controllo sull'unico elemento indispensabile per l'inserimento, cioè il nome    
                if (nome !== "" && ingredi.checked == true) {

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

                } else if (nome_azione !== "" && azio.checked == true) {

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
                        vara_glob = { nome: nome.value };

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

                    // questo json-format mi serve per inserire l'azione nella lista locale
                    let inse = {
                        id: idi,
                        nome: nome_azione.value,
                        durata: durata.value,
                        condizione:""
                    };

                    // inserisco infine nella lista
                    azioni.push(inse);

                    // questo json- format mi serve per inserire l'azione nel fil xml
                    let inse2 = {
                        ricetta: sessionStorage.getItem("nome_file"),
                        id: idi,
                        nome: nome_azione.value,
                        durata: durata.value,
                        condizione : ""
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
                    alert("qualcosa non è andato bene");
                    scrivi = false;
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
    }
});


// questa funzione mi permette di creare link
$("#vedo").mousedown(function (evt) {

    // devo controllare se il bottone in alto sia correttamente checked
    if (linkabile.checked == true) {       

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
    }
});

// questa funzione mi permette di muovere il link createo con l'azione precedente
$("#vedo").mousemove(function (er) {

    // controllo sempre che l'utente non abbia cambiato il checked sopra
    if (linkabile.checked == true) {

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
// per poi validarlo e finire la transizione
$("#vedo").mouseup(function (e) {

    // una volta finito di muovere il mio link posso far tornare il panneling
    grafico.enablePan();

    // posso anche far tornare le box con le info che compaiono onmousehover
    $('rect').popover({
        trigger: 'hover'
    });
    $('[data-toggle="popover"]').popover("enable");

    // se sono sicuro che l'utente voglia stabilire un nuovo link
    if (linkabile.checked == true) {

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
                                        data: dati
                                    });

                                } else if (id1.includes("a", 1) && id2.includes("i", 1)) {
                                    let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id2, target: id1 };
                                    $.ajax({
                                        url: 'cancella_post.php',
                                        type: 'POST',
                                        data: dati
                                    });

                                } else if (id1.includes("i", 1) && id2.includes("a", 1)) {
                                    let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id1, target: id2 };
                                    $.ajax({
                                        url: 'cancella_pre.php',
                                        type: 'POST',
                                        data: dati
                                    });
                                }
                            }

                            let inf = info_ingrediente(nodo_target);
                            let dati = { ricetta: sessionStorage.getItem("nome_file"), idazione: nodo_source, idingrediente: nodo_target, nomeingrediente: inf.nome, quantita: inf.quantita };
                            $.ajax({
                                url: 'inserimento_post.php',
                                type: 'POST',
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
                                    data: dati
                                });

                            } else if (id1.includes("a", 1) && id2.includes("i", 1)) {
                                let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id2, target: id1 };
                                $.ajax({
                                    url: 'cancella_post.php',
                                    type: 'POST',
                                    data: dati
                                });

                            } else if (id1.includes("i", 1) && id2.includes("a", 1)) {
                                let dati = { ricetta: sessionStorage.getItem("nome_file"), source: id1, target: id2 };
                                $.ajax({
                                    url: 'cancella_pre.php',
                                    type: 'POST',
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
                                let linki = { ricetta: sessionStorage.getItem("nome_file"), source: nodo_source, target: nodo_target };
                                $.ajax({
                                    url: 'inserimento_relazione_simul.php',
                                    type: 'POST',
                                    data: linki
                                });
                                $.ajax({
                                    url: 'cancella_relazione_ordine.php',
                                    type: 'POST',
                                    data: linki
                                });
                            } else {
                                let linki = { ricetta: sessionStorage.getItem("nome_file"), source: nodo_source, target: nodo_target };
                                $.ajax({
                                    url: 'inserimento_relazione_ordine.php',
                                    type: 'POST',
                                    data: linki
                                });
                            }
                        } else if (tipologia_nodo_source === "ingrediente") {

                            let inf = info_ingrediente(nodo_source);
                            let dati = { ricetta: sessionStorage.getItem("nome_file"), idazione: nodo_target, idingrediente: nodo_source, nomeingrediente: inf.nome, quantita: inf.quantita };
                            $.ajax({
                                url: 'inserimento_pre.php',
                                type: 'POST',
                                data: dati
                            });
                        }
                    }
                    if (!ingre_ingre) {

                        let pos_ini_y = linea.getAttribute("y1");
                        let pos_ini_x = linea.getAttribute("x1");
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
                                pos_fin_y = (pos_fin_x - 65);
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
                                pos_fin_x = (pos_fin_x - 45);
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
        console.log(kidse);
        kidse.removeClass("oggetto2");
        kidse.addClass("oggetto");
        }
    }
});