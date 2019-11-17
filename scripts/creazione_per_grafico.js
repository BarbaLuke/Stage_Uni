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

function esiste(idsource, idtarget) {
    let bool = false;
    for (i = 0; i < link.length; i++) {
        if (link[i].source === idsource && link[i].target === idtarget) {
            bool = true;
        }
    }
    return bool;
}

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

//questa funzione mi permette di creare oggetti cioè cerchi o rettangoli
// cioè ingredienti o azioni nel mio grafico SVG
$("#vedo").click(function (evt) {
    let scrivi = true;
    var target = $(evt.target);
    if (inserimento_nodi.checked == true && !(target.is("circle")) && !(target.is("rect")) && !(target.is("line"))) {
        $('#insert_ingrediente').modal({
            show: true
        });
        
        let azio = document.getElementById("azion");
        let ing = document.getElementById("ingred");
        var lista = document.getElementById("globali");

        for (a = 0; a < ingredienti_globali.length; a++) {
            let inni = "<option value='" + ingredienti_globali[a].nome + "'>" + ingredienti_globali[a].nome + "</option>";
            lista.innerHTML += inni;
        }
        if (azio.checked == true) {
            $(".solo_ingrediente").hide();
        }
        if (ing.checked == true) {
            $(".solo_azione").hide();
        }
        $("#azion").click(function (e) {
            $(".solo_ingrediente").hide();
            $(".solo_azione").show();
        });
        $("#ingred").click(function (e) {
            $(".solo_ingrediente").show();
            $(".solo_azione").hide();
        });
        $("#salva_inserimento").click(function (ev) {
            
            if (scrivi === true) {
                let nome = document.getElementById("nome_nodo");
                let ingredi = document.getElementById("ingred");
                let quant = document.getElementById("quantita_nodo");
                let imma = document.getElementById("immagine_nodo");
                let nome_azione = document.getElementById("nome_nodo2");
                let durata = document.getElementById("durata_nodo");
                var
                    x = evt.clientX,
                    y = evt.clientY,
                    svgP = svgPoint(svg, x, y),
                    xe = Math.round(svgP.x),
                    ye = Math.round(svgP.y);
                if (nome !== "") {
                    if (ingredi.checked == true) {

                        let non = true;

                        for (n = 0; n < ingredienti_globali.length; n++) {

                            if (ingredienti_globali[n].nome === nome.value) {
                                non = false;
                                if(imma.value !== ""){

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
                                    ingredienti_globali[n].immagine = imma.value;
                                    sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));

                                }else{
                                    imma.value = ingredienti_globali[n].nome
                                }
                            }
                        }
                        if (non) {

                            vara_glob = { nome: nome.value, immagine: imma.value };

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
                            nome: nome.value,
                            quantita: quant.value,
                            immagine: imma.value
                        };
                        ingredienti_totali.push(inse);
                        let inse2 = {
                            ricetta: sessionStorage.getItem("nome_file"),
                            id: idi,
                            nome: nome.value,
                            quantita: quant.value
                        };
                        crea_oggetto(idi, xe, ye);
                        $.ajax({
                            url: 'inserimento_ingrediente.php',
                            type: 'POST',
                            data: inse2
                        });
                    } else if (azio.checked == true) {
                        let idi = cerca_ultimo_id_azioni();
                        let inse = {
                            id: idi,
                            nome: nome_azione.value,
                            durata: durata.value
                        };
                        azioni.push(inse);

                        let inse2 = {
                            ricetta: sessionStorage.getItem("nome_file"),
                            id: idi,
                            nome: nome_azione.value,
                            durata: durata.value
                        };
                        crea_oggetto(idi, xe, ye);
                        $.ajax({
                            url: 'inserimento_azione.php',
                            type: 'POST',
                            data: inse2
                        });
                    }
                    scrivi = false;
                } else {
                    alert("hai dimenticato il nome");
                }
                
            }
            $('circle').popover({
                trigger: 'hover'
              })
            $('rect').popover({
                trigger: 'hover'
              })
        });
        $("#annulla_insertnodo").click(function (ev) {
            scrivi = false;
            
        });
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
            $('[data-toggle="popover"]').popover("disable");

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
            $('[data-toggle="popover"]').popover("disable");

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
        $('[data-toggle="popover"]').popover("enable");
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
    if (linkabile.checked == true) {
        if (muovilo) {
            var ingre_ingre = false;
            $('[data-toggle="popover"]').popover("enable");
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