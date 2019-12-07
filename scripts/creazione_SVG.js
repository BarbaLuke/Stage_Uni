function crea_oggetto(idd, posizione_x, posizione_y) {

    if (idd.includes("i")) {

        for (b = 0; b < ingredienti_totali.length; b++) {
            if (idd === ingredienti_totali[b].id) {
                if (ingredienti_totali[b].immagine !== "") {

                    immagine = '<pattern patternContentUnits="objectBoundingBox" id="' + idd + '_imm" x="' + posizione_x + '" y="' + posizione_y + '" height="100%" width="100%" viewBox="0 0 70 70" preserveAspectRatio="xMidYMid slice"> <image x="0%" y="0%" height="70" width="70" preserveAspectRatio="xMidYMid slice" xlink:href="' + ingredienti_totali[b].immagine + '"> </image> </pattern>';
                    document.getElementById("definizioni").innerHTML += immagine;
                    varae = '<circle id="' + idd + '" cx=' + posizione_x + ' cy=' + posizione_y + ' r=35 fill="url(#' + idd + '_imm)" stroke-width="5" stroke="black" class="oggetto" data-toggle="popover" data-trigger="hover" title="Id : <strong>' + ingredienti_totali[b].id + '</strong>" data-placement="top" data-html="true" data-content="Nome : <strong>' + ingredienti_totali[b].nome + '</strong> <br> Quantità : <strong>' + ingredienti_totali[b].quantita + '</strong>"/>';
                    document.getElementById("vedo2").innerHTML += varae;

                } else {

                    varae = '<circle id="' + idd + '" cx=' + posizione_x + ' cy=' + posizione_y + ' r=35 fill="#22324A" class="oggetto" data-toggle="popover" data-trigger="hover" title="Id : <strong>' + ingredienti_totali[b].id + '</strong>" data-placement="top" data-html="true" data-content="Nome : <strong>' + ingredienti_totali[b].nome + '</strong> <br> Quantità : <strong>' + ingredienti_totali[b].quantita + '</strong>"/>';
                    document.getElementById("vedo2").innerHTML += varae;

                }
            }
        }
    }else {

        for (c = 0; c < azioni.length; c++) {
            if (idd === azioni[c].id) {
                if (azioni[c].condizione !== "") {

                    varae = '<rect id="' + azioni[c].id + '" x=' + (posizione_x - 25) + ' y=' + (posizione_y - 25) + ' width="50"; height="50"; class="oggetto"; fill="#ce7400"; data-toggle="popover"; data-trigget="hover"; title="Id : <strong>' + azioni[c].id + '</strong>" data-placement="top"; data-html="true" data-content="Nome : <strong>' + azioni[c].nome + '</strong> <br> Durata : <strong>' + azioni[c].durata + '</strong> <br> Condzione : <strong>' + azioni[c].condizione + '</strong>"/>';
                    document.getElementById("vedo2").innerHTML += varae;

                }else {

                    varae = '<rect id="' + azioni[c].id + '" x=' + (posizione_x - 25) + ' y=' + (posizione_y - 25) + ' width="50"; height="50"; class="oggetto"; fill="#972323"; data-toggle="popover"; data-trigget="hover"; title="Id : <strong>' + azioni[c].id + '</strong>" data-placement="top"; data-html="true" data-content="Nome : <strong>' + azioni[c].nome + '</strong> <br> Durata : <strong>' + azioni[c].durata + '</strong>"/>';
                    document.getElementById("vedo2").innerHTML += varae;

                }
            }
        }

    }
}

function crea_oggetto_dopo(posizione_x, posizione_y) {
    varae = '<circle cx=' + posizione_x + ' cy=' + posizione_y + ' r=35 fill="red"  class="oggetto"  data-toggle="popover" title="Ingrediente" data-placement="top" data-content="Qui ci andranno nome e quantità"/>';
    document.getElementById("vedo2").innerHTML += varae;
}

// con questa funzioe vado a creare i nodi visualizzabili
function creazione_elementi_SVG() {
    for (a = 0; a < lista_inseriti.length; a++) {
        if (lista_inseriti[a].posx !== 1) {
            crea_oggetto(lista_inseriti[a].id, lista_inseriti[a].posx * 300, (lista_inseriti[a].posy) * 150 + 150 * (lista_inseriti[a].posy - 1));
        }
    }
}

// con questa funzione creo il testo da inserire dentro i pallini o i quadrati
function inserimento_testo() {
    /*
    for(a=0;a<lista_inseriti.length;a++){
        prova=10;
        for(b=0;b<ingredienti_totali.length;b++){
            if(lista_inseriti[a].id===ingredienti_totali[b].id){
                test=ingredienti_totali[b].id;
                spazio=0;
            }
        }
        for(c=0;c<azioni.length;c++){
            if(lista_inseriti[a].id===azioni[c].id){
                test=azioni[c].id;
                spazio=15;
            }
        }
        tes='<text x="' + (lista_inseriti[a].posx*300 + spazio) + '" y="' + (((lista_inseriti[a].posy)*150 + 150*(lista_inseriti[a].posy-1))  + spazio) + '" text-anchor="middle" style="font-size:5vh; font-weight: bolder;" data-toggle="popover" title="Ingrediente" data-content="Qui ci andranno nome e quantità">' + test + '</text>';
        document.getElementById("vedo2").innerHTML+=tes;
    }
     
     */
}

// l'idea era di creare funzioni separate ma non so se questo insieme
// di funzioni lo terrò come funzione separata o lo aggregherò al resto
function creazione_collegamenti() {
    // la funzione va a pescare ogni link nella lista link
    for (a = 0; a < link.length; a++) {
        // queste variabili conterranno diverse info come presumibile dal nome
        let id_ini = "";
        let id_fin = "";
        let pos_ini_x = 0;
        let pos_ini_y = 0;
        let pos_fin_x = 25;
        let pos_fin_y = 25;

        let ing_ini;

        let ing_fin;

        // queste informazioni sono contenute nell'array della lista_inseriti
        for (b = 0; b < lista_inseriti.length; b++) {
            // in base al fatto che l'elemento che sto controllando sia una source
            // o un target procedo di seguito ad aggiornare le variabili sopra
            if (lista_inseriti[b].id === link[a].source) {
                if (lista_inseriti[b].id.includes("i")) {
                    ing_ini = true;

                } else {

                    ing_ini = false;
                }
                id_ini = lista_inseriti[b].id;
                pos_ini_x = lista_inseriti[b].posx;
                pos_ini_y = lista_inseriti[b].posy;
            }
            if (lista_inseriti[b].id === link[a].target) {
                if (lista_inseriti[b].id.includes("i")) {
                    ing_fin = true;

                } else {

                    ing_fin = false;
                }
                id_fin = lista_inseriti[b].id;
                pos_fin_x = lista_inseriti[b].posx;
                pos_fin_y = lista_inseriti[b].posy;
            }

        }
        let colore;
        if (ing_ini) {

            colore = "#E94F37";

        } else if (ing_fin) {

            colore = "#5C415D";

        } else {

            colore = "#076B26";

        }

        if (ing_ini) {
            if (pos_ini_y === pos_fin_y && pos_ini_x > pos_fin_x) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300 + 35) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300 + 65) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1)) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            } else if (pos_ini_y === pos_fin_y && pos_ini_x < pos_fin_x) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300 + 35) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300 - 65) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1)) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            }
            else if (pos_ini_y < pos_fin_y && pos_ini_x < pos_fin_x) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300 - 45) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 35) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            }
            else if (pos_ini_y < pos_fin_y && pos_ini_x === pos_fin_x) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 65) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            }
            else if (pos_ini_y < pos_fin_y && pos_ini_x > pos_fin_x) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300 + 45) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 35) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            }
            else if (pos_ini_y > pos_fin_y && pos_ini_x < pos_fin_x) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300 - 45) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) + 35) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            }
            else if (pos_ini_y > pos_fin_y && pos_ini_x === pos_fin_x) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) + 65) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            }
            else if (pos_ini_y > pos_fin_y && pos_ini_x > pos_fin_x) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300 + 55) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) + 35) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            }

        } else {
            if (pos_ini_y === pos_fin_y && pos_ini_x > pos_fin_x && ing_fin) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300 + 25) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300 - 75) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1)) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            } else if (pos_ini_y === pos_fin_y && pos_ini_x > pos_fin_x && !ing_fin) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300 + 25) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300 + 25) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 45) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            } else if (pos_ini_y === pos_fin_y && pos_ini_x < pos_fin_x && !ing_fin) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300 + 25) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300 - 65) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1)) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            } else if (pos_ini_y === pos_fin_y && pos_ini_x < pos_fin_x && ing_fin) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300 + 25) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300 - 65) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1)) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            } else if (pos_ini_y < pos_fin_y && pos_ini_x < pos_fin_x) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300 - 45) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 35) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            } else if (pos_ini_y < pos_fin_y && pos_ini_x === pos_fin_x) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 65) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            } else if (pos_ini_y < pos_fin_y && pos_ini_x > pos_fin_x) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300 + 45) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 35) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            } else if (pos_ini_y > pos_fin_y && pos_ini_x < pos_fin_x) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300 - 45) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) + 35) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            } else if (pos_ini_y > pos_fin_y && pos_ini_x === pos_fin_x) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) + 65) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            } else if (pos_ini_y > pos_fin_y && pos_ini_x > pos_fin_x) {
                frecc = '<line id="' + id_ini + '_' + id_fin + '" x1="' + (pos_ini_x * 300) + '" y1="' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + '" x2="' + (pos_fin_x * 300 + 55) + '" y2="' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) + 35) + '" stroke="' + colore + '" stroke-width="15"  marker-end="url(#arrow)" />';
            }
        }
        // infine aggiungo al mio SVG le line per creare i link visibili
        document.getElementById("vedo2").innerHTML += frecc;
        fre = { id_inizio: id_ini, id_fine: id_fin };
        lista_freccie.push(fre);
    }
    for (a = 0; a < link_dopo.length; a++) {

        // queste variabili conterranno diverse info come presumibile dal nome
        let id_ini = "";
        let id_fin = "";
        let pos_ini_x = 0;
        let pos_ini_y = 0;
        let pos_fin_x = 25;
        let pos_fin_y = 25;

        // queste informazioni sono contenute nell'array della lista_inseriti
        for (b = 0; b < lista_inseriti.length; b++) {
            // in base al fatto che l'elemento che sto controllando sia una source
            // o un target procedo di seguito ad aggiornare le variabili sopra
            if (lista_inseriti[b].id === link_dopo[a].source) {
                id_ini = lista_inseriti[b].id;
                pos_ini_x = lista_inseriti[b].posx;
                pos_ini_y = lista_inseriti[b].posy;
            }
            if (lista_inseriti[b].id === link_dopo[a].target) {
                id_fin = lista_inseriti[b].id;
                pos_fin_x = lista_inseriti[b].posx;
                pos_fin_y = lista_inseriti[b].posy;
            }
        }
        if (pos_ini_y === pos_fin_y && pos_ini_x > pos_fin_x) {
            frecc = '<path id="' + id_ini + '_' + id_fin + '" d="M' + (pos_ini_x * 300 + 25) + ',' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + ' Q' + ((pos_ini_x * 300) - 50) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 150) + ' ' + (pos_fin_x * 300 + 25) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 45) + '" stroke="#FF495C" stroke-width="15" stroke-dasharray="25,25"  marker-end="url(#arrow)" fill-opacity="0" />';
        } else if (pos_ini_y === pos_fin_y && pos_ini_x < pos_fin_x) {
            frecc = '<path id="' + id_ini + '_' + id_fin + '" d="M' + (pos_ini_x * 300 + 25) + ',' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + ' Q' + ((pos_ini_x * 300) - 50) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 150) + ' ' + (pos_fin_x * 300 - 65) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1)) + '" stroke="#FF495C" stroke-width="15" stroke-dasharray="25,25"  marker-end="url(#arrow)" fill-opacity="0" />';
        } else if (pos_ini_y < pos_fin_y && pos_ini_x < pos_fin_x) {
            frecc = '<path id="' + id_ini + '_' + id_fin + '" d="M' + (pos_ini_x * 300) + ',' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + ' Q' + ((pos_ini_x * 300) - 50) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 150) + ' ' + (pos_fin_x * 300 - 45) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 35) + '" stroke="#FF495C" stroke-width="15" stroke-dasharray="25,25"  marker-end="url(#arrow)" fill-opacity="0" />';
        } else if (pos_ini_y < pos_fin_y && pos_ini_x === pos_fin_x) {
            frecc = '<path id="' + id_ini + '_' + id_fin + '" d="M' + (pos_ini_x * 300) + ',' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + ' Q' + ((pos_ini_x * 300) - 50) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 150) + ' ' + (pos_fin_x * 300) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 65) + '" stroke="#FF495C" stroke-width="15" stroke-dasharray="25,25"  marker-end="url(#arrow)" fill-opacity="0" />';
        } else if (pos_ini_y < pos_fin_y && pos_ini_x > pos_fin_x) {
            frecc = '<path id="' + id_ini + '_' + id_fin + '" d="M' + (pos_ini_x * 300) + ',' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + ' Q' + ((pos_ini_x * 300) - 50) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 150) + ' ' + (pos_fin_x * 300 + 45) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 35) + '" stroke="#FF495C" stroke-width="15" stroke-dasharray="25,25"  marker-end="url(#arrow)" fill-opacity="0" />';
        } else if (pos_ini_y > pos_fin_y && pos_ini_x < pos_fin_x) {
            frecc = '<path id="' + id_ini + '_' + id_fin + '" d="M' + (pos_ini_x * 300) + ',' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + ' Q' + ((pos_ini_x * 300) - 50) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 150) + ' ' + (pos_fin_x * 300 - 45) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) + 35) + '" stroke="#FF495C" stroke-width="15" stroke-dasharray="25,25"  marker-end="url(#arrow)" fill-opacity="0" />';
        } else if (pos_ini_y > pos_fin_y && pos_ini_x === pos_fin_x) {
            frecc = '<path id="' + id_ini + '_' + id_fin + '" d="M' + (pos_ini_x * 300) + ',' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + ' Q' + ((pos_ini_x * 300) - 50) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 150) + ' ' + (pos_fin_x * 300) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) + 65) + '" stroke="#FF495C" stroke-width="15" stroke-dasharray="25,25"  marker-end="url(#arrow)" fill-opacity="0" />';
        } else if (pos_ini_y > pos_fin_y && pos_ini_x > pos_fin_x) {
            frecc = '<path id="' + id_ini + '_' + id_fin + '" d="M' + (pos_ini_x * 300) + ',' + ((pos_ini_y) * 150 + 150 * (pos_ini_y - 1)) + ' Q' + ((pos_ini_x * 300) - 50) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1) - 150) + ' ' + (pos_fin_x * 300 + 55) + ',' + ((pos_fin_y) * 150 + 150 * (pos_fin_y - 1)) + '" stroke="#FF495C" stroke-width="15" stroke-dasharray="25,25"  marker-end="url(#arrow)" fill-opacity="0" />';
        }
        // infine aggiungo al mio SVG le line per creare i link visibili
        document.getElementById("vedo2").innerHTML += frecc;
        fre = { id_inizio: id_ini, id_fine: id_fin };
        lista_freccie.push(fre);
    }
}

function crea_link(id, x_inizio, y_inizio) {
    frecc = '<line id="' + id + '" x1="' + x_inizio + '" y1="' + y_inizio + '" x2="' + x_inizio + '" y2="' + y_inizio + '"stroke="#076B26" stroke-width="15"  marker-end="url(#arrow)" />';
    document.getElementById("vedo2").innerHTML += frecc;
}

function crea_condizio(id, x_inizio, y_inizio, se) {
    if(se){

        frecc = '<line id="' + id + '" x1="' + x_inizio + '" y1="' + y_inizio + '" x2="' + x_inizio + '" y2="' + y_inizio + '"stroke="#076B26" stroke-width="15"  marker-end="url(#arrow)" />';

    }else{
        frecc = '<line id="' + id + '" x1="' + x_inizio + '" y1="' + y_inizio + '" x2="' + x_inizio + '" y2="' + y_inizio + '"stroke="#FF495C" stroke-width="15" stroke-dasharray="25,25"  marker-end="url(#arrow)" />';
    }
    
    document.getElementById("vedo2").innerHTML += frecc;
}