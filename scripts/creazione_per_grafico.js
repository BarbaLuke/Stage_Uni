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

        // questo ciclo serve ad inserire le opzioni per l'inserimento del nome dell'ingrediente
        for (a = 0; a < ingredienti_globali.length; a++) {
            let puoi = true;
            for(x = 0; x < ingredienti_totali.length; x++){
    
                if(puoi && ingredienti_globali[a].nome === ingredienti_totali[x].nome){
    
                    puoi = false;
    
                }
            }
            if(puoi){
    
                let inni = "<option value='" + ingredienti_globali[a].nome + "'>" + ingredienti_globali[a].nome + "</option>";
                lista.innerHTML += inni;
    
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
                if (nome !== "") {

                    // nel caso l'utente abbia inserito le info per l'ingrediente
                    if (ingredi.checked == true) {
                        
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
                                if(imma.value !== ""){

                                    // questa è la chiamata per la modifica
                                    let insero = {nome: ingredienti_globali[n].nome, immagine: imma.value}
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

                                    // aggiorno quindi anche la lista degli ingredienti globali nel caso in cui abbia cambiato l'immagine
                                    ingredienti_globali[n].immagine = imma.value;
                                    sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));

                                }else{

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
                            type: 'POST',
                            data: inse2
                        });
                    } else if (azio.checked == true) {
                        // prendo in esame infine il caso dell'inserimento dell'azione
                        // come prime devo cercare l'id più uno rispetto all'ultimo id delle azioni
                        let idi = cerca_ultimo_id_azioni();

                        // questo json-format mi serve per inserire l'azione nella lista locale
                        let inse = {
                            id: idi,
                            nome: nome_azione.value,
                            durata: durata.value
                        };

                        // inserisco infine nella lista
                        azioni.push(inse);

                        // questo json- format mi serve per inserire l'azione nel fil xml
                        let inse2 = {
                            ricetta: sessionStorage.getItem("nome_file"),
                            id: idi,
                            nome: nome_azione.value,
                            durata: durata.value
                        };

                        // creo l'oggetto da inserire nel grafico
                        crea_oggetto(idi, xe, ye);

                        // eseguo la chiamata per l'inserimento dell'azione nel file xml
                        $.ajax({
                            url: 'inserimento_azione.php',
                            type: 'POST',
                            data: inse2
                        });
                    }

                    // alla fine dell'inserimento chiudo l'evento mettendo scrivi a false e impedendo la scrittura futura
                    // ho il problema che non inserendo questa variabile mi esegua una scrittuare nel caso in cui non concluda la procedura
                    scrivi = false;
                } else {

                    // nel caso in cui l'utente non abbia inserito il nome dell'azione o dell'ingrediente
                    alert("hai dimenticato il nome");
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

var
nodo_source = "",
tipologia_nodo_source = "",
tipologia_nodo_target = "",
nodo_target = "";

// questa funzione mi permette di creare link
$("#vedo").mousedown(function (evt) {
    if (linkabile.checked == true) {
        var target = $(evt.target);

        if (target.attr('class') === "oggetto") {
            grafico.disablePan();
            nodo_source = target.attr("id");
            var
                kids = $("#vedo2").children("rect,circle"),
                x = 0,
                y = 0;
            $(evt.target).popover("hide");
            
            muovilo = true;
            crealo = true;

            if (target.is("circle")) {
                tipologia_nodo_source = "ingrediente";
                x = target.attr("cx");
                y = target.attr("cy");

            } else if (target.is("rect")) {
                tipologia_nodo_source = "azione";
                x = target.attr("x");
                y = target.attr("y");
            }

            kids.removeClass("oggetto");
            kids.addClass("oggetto2");
            crea_link((nodo_source + "_"), x, y);
        }

        if (target.is("line")) {

            grafico.disablePan();
            da_muovere = target.attr("id");
            nodo_source = target.attr("id").split("_")[0];
            if (nodo_source.includes("i")) {
                tipologia_nodo_source = "ingrediente";
            } else {
                tipologia_nodo_source = "azione";
            }

            coordinata_prima_x = target.attr("x2");
            coordinata_prima_y = target.attr("y2");
            console.log(nodo_source);
            var kids = $("#vedo2").children("rect,circle");
            //$('[data-toggle="popover"]').popover("disable");

            muovilo = true;
            crealo = false;

            kids.removeClass("oggetto");
            kids.addClass("oggetto2");

        }
    }
});

// questa funzione mi permette di muovere il link create con lp'azione precedente
$("#vedo").mousemove(function (er) {
    if (linkabile.checked == true) {
        if (muovilo) {
            var
                x = er.clientX,
                y = er.clientY,
                svgP = svgPoint(svg, x, y);
            if (crealo) {

                linea = document.getElementById(nodo_source + "_");

            } else {

                linea = document.getElementById(da_muovere);

            }

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
    grafico.enablePan();
    $('rect').popover({
        trigger: 'hover'
      });
    $('[data-toggle="popover"]').popover("enable");
    if (linkabile.checked == true) {
        if (muovilo) {
            var ingre_ingre = false;
            
            var
                kidse = $("#vedo2").children("rect,circle"),
                target2 = $(e.target);

            if (crealo) {

                linea = document.getElementById(nodo_source + "_");

            } else {

                linea = document.getElementById(da_muovere);

            }

            x = 0,
                y = 0;
            let nodo_target = target2.attr("id");
            esiste_gia = esiste(nodo_source, nodo_target);
            if (target2.attr('class') === "oggetto2") {
                if (!esiste_gia) {
                    if (target2.is("circle")) {
                        x = target2.attr("cx");
                        y = target2.attr("cy");
                        if (tipologia_nodo_source === "azione") {

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

                        console.log(pos_fin_x, pos_fin_y);

                        linea.setAttribute("x2", pos_fin_x);
                        linea.setAttribute("y2", pos_fin_y);

                        linea.setAttribute("id", nodo_source + "_" + nodo_target);
                        let inse = { source: nodo_source, target: nodo_target };
                        link.push(inse);
                        cerca_ed_elimina(da_muovere);

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
            crealo = false;
            kidse.removeClass("oggetto2");
            kidse.addClass("oggetto");
        }
    }
});