function calcolo_nodi_e_link(xml, callback) {

    var dove = document.getElementById("formo");

    var lis = document.getElementById("globali_nuovi");


    var puoi_aprire = false;

    var da_in = [];


    // questo sotto è il risultato della funzione di richiamo cioè il file xml
    var xmlDoc = xml.responseXML;

    // mi servono tutti i figli del nodo centrale
    x = xmlDoc.documentElement.childNodes;

    // con questo ciclo riempio gli array che mi serviranno da appoggio per 
    // sviluppare il grafico
    for (i = 0; i < x.length; i++) {

        // con questo riempio l' array con i link diretti tra le azioni
        if (x[i].nodeType == 1 && x[i].nodeName === "RELAZIONEdORDINE") {

            vara = {
                source: x[i].getAttribute('IDazionePrec'),
                target: x[i].getAttribute('IDazioneSucc')
            };

            link.push(vara);
        }

        // con questo riempio la text area per la ricetta testuale
        if (x[i].nodeType == 1 && x[i].nodeName === "TESTO") {

            if(typeof  x[i].childNodes[0] !== "undefined"){
                $("#testo_ri").val(x[i].childNodes[0].nodeValue);
                testo = x[i].childNodes[0].nodeValue;
            }
            
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
            link_dopo.push(vara);
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
                            && z[k].nodeName === "QUANTUSATA") {
                            let idingr = z[k].getAttribute('IDingrediente');
                            let quant = z[k].childNodes[0].nodeValue;
                            let percosa = x[i].getAttribute('IDazione');
                            inno = { ingrediente: idingr, quanto: quant, azione: percosa };
                            quantcosa.push(inno);
                        }

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
                condizione: cond,
                immagine : ""
            };
            azioni.push(vara);
        }
    }

    // questo mi serve per inserire le azioni nella lista globale delle azioni
    for (d = 0; d < azioni.length; d++) {

        let inserisci_global_act = true;

        azioni_globali = JSON.parse(sessionStorage.getItem("azioni_global"));

        for (b = 0; b < azioni_globali.length; b++) {

            if (azioni_globali[b].nome.replace(/\s+/g, '') === azioni[d].nome.replace(/\s+/g, '')) {

                inserisci_global_act = false;

                azioni[d].immagine = azioni_globali[b].immagine;
            }
        }

        if (inserisci_global_act) {

            vara_glob_act = { nome: azioni[d].nome, immagine: ""};

            azioni_globali.push(vara_glob_act);

            sessionStorage.setItem("azioni_global", JSON.stringify(azioni_globali));

            $.ajax({
                url: 'aggiungi_azione_globale.php',
                async: false,
                type: 'POST',
                data: vara_glob_act
            });
        }
    }

    for (a = 0; a < ingredienti_globali.length; a++) {
        let pu = true;
        for (x = 0; x < ingredienti_totali.length; x++) {

            if (pu && ingredienti_globali[a].nome === ingredienti_totali[x].nome) {

                pu = false;

            }
        }
        if (pu) {

            let inni1 = "<option value='" + ingredienti_globali[a].nome + "'>" + ingredienti_globali[a].nome + "</option>";
            lis.innerHTML += inni1;

        }
    }

    // questa serie di funzioni mi serve per inserire in modo asincrono i nodi degli ingredienti 
    // che potrebbero avere nomi sbagliati e quindi do la possibilità all'utente di cambiare nome a tutto
    for (h = 0; h < ingredienti_totali.length; h++) {
        let esistegia = false;
        for (b = 0; b < ingredienti_globali.length; b++) {
            if (ingredienti_totali[h].nome.replace(/\s+/g, '') === ingredienti_globali[b].nome.replace(/\s+/g, '')) {
                esistegia = true;
                ingredienti_totali[h].immagine = ingredienti_globali[b].immagine;

            }
        }

        let testo = "";

        if (!esistegia) {
            if (!puoi_aprire) {

                puoi_aprire = true;

            }

            let nuovo = { id: ingredienti_totali[h].id, nome: ingredienti_totali[h].nome };

            da_in.push(nuovo);

            testo = "<label style='margin-top: 25px;'>Nome dell' ingrediente " + ingredienti_totali[h].id + "</label>";
            testo += '<input list="globali_nuovi" id="' + ingredienti_totali[h].id + '_mode" name="nome" value="' + ingredienti_totali[h].nome + '" class="form-control custom-select custom-select-md" placeholder="Nome ingrediente">';

            dove.innerHTML += testo;

        }
    }

    if (puoi_aprire) {

        $('#insert_ingrediente_globale').modal({
            show: true,
            backdrop: 'static',
            keyboard: false
        });

        $('#salva_inserimento_globalissimo').click(function (evt) {
            var posso_procedere = true;
            
            for (t = 0; t < da_in.length; t++) {
                let controllo = $("#" + da_in[t].id + "_mode").val();
                if (controllo === "") {
                    posso_procedere = false;
                    t = da_in.length;
                }
            }
            if (!posso_procedere) {

                alert("nessun campo deve essere vuoto");

            } else {
                
                for (w = 0; w < ingredienti_totali.length; w++) {
                    for (q = 0; q < da_in.length; q++) {
                        if (da_in[q].id === ingredienti_totali[w].id) {
                            let controllone = $("#" + da_in[q].id + "_mode").val();
                            if (controllone !== ingredienti_totali[w].nome) {
                                ingredienti_totali[w].nome = controllone;
                                let modif = {
                                    ricetta: sessionStorage.getItem("nome_file"),
                                    id: da_in[q].id,
                                    nome: controllone,
                                    quantita: ingredienti_totali[w].quantita
                                };
                                $.ajax({
                                    url: 'modifica_ingrediente.php',
                                    type: 'POST',
                                    async: false,
                                    data: modif
                                });
                            }

                            let none = true;

                            for (e = 0; e < ingredienti_globali.length; e++) {

                                if (controllone.replace(/\s+/g, '') === ingredienti_globali[e].nome.replace(/\s+/g, '') && none) {

                                    none = false;
                                    e = ingredienti_globali.length;
                                }
                            }

                            if (none) {


                                add_glob = { nome: controllone, immagine: "" };

                                ingredienti_globali.push(add_glob);

                                sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));

                                ingredienti_globali = JSON.parse(sessionStorage.getItem("ingredienti_global"));

                                $.ajax({

                                    url: 'aggiungi_ingrediente_globale.php',
                                    type: 'POST',
                                    async: false,
                                    data: add_glob
                                });
                            }
                        }
                    }
                }

                $('#insert_ingrediente_globale').modal('hide');

                // creo una lista di adiacenza per ogni nodo per
                //  vedere quanti controlli devo fare
                var riempi = {};

                // inserisco ogni ingrediente i nodi collegati e il numero di archi
                //  fino a qui per ora saranno 0 visto non ho ancora cercato nulla
                for (a = 0; a < ingredienti_totali.length; a++) {

                    riempi = {
                        id: ingredienti_totali[a].id,
                        nodi_collegati: [],
                        num_archi_fino_a_qui: 0
                    };

                    lista_adj.push(riempi);
                }

                // inserisco ogni azione i nodi collegati e il numero di archi fino a qui
                // per ora saranno 0 visto non ho ancora cercato nulla
                for (a = 0; a < azioni.length; a++) {

                    riempi = {
                        id: azioni[a].id,
                        nodi_collegati: [],
                        num_archi_fino_a_qui: 0
                    };

                    lista_adj.push(riempi);
                }
                // inserisco i nodi collegati per ogni nodo,
                //  che sarebbero sicuramente più di uno in un array
                for (a = 0; a < lista_adj.length; a++) {

                    for (b = 0; b < link.length; b++) {

                        if (lista_adj[a].id === link[b].source) {

                            lista_adj[a].nodi_collegati.push(link[b].target);
                        }
                    }
                }

                // per gli ingredienti
                // per ogni nodo nella lista, se questo è un ingrediente 
                // oltre che a sdoppiarlo nella lista,
                // devo anche sdoppiarlo nella lista degli ingredienti
                for (a = 0; a < lista2.length; a++) {

                    // se il mio nodo ha più di un collegamento
                    if (lista2[a].nodi_collegati.length > 1) {

                        // vado a cercare il corrispondente nodo nella lista 
                        // degli ingredienti
                        for (c = 0; c < ingredienti_totali.length; c++) {

                            if (lista2[a].id === ingredienti_totali[c].id) {

                                var ingre = ingredienti_totali[c];
                                var iddo = ingre.id;

                                // e lo aggiungo in ingredienti totali
                                ingredienti_totali[c].id = iddo;

                                for (b = 1; b < lista2[a].nodi_collegati.length; b++) {

                                    ver = {
                                        id: iddo + "_" + (b),
                                        nome: ingre.nome,
                                        quantita: ingre.quantita
                                    };

                                    ingredienti_totali.push(ver);
                                }
                            }
                        }
                    }
                }

                //per le azioni
                // per ogni nodo nella lista, se questo è un' azione 
                // oltre che a sdoppiarlo nella lista,
                // devo anche sdoppiarlo nella lista delle azioni
                for (a = 0; a < lista2.length; a++) {

                    if (lista2[a].nodi_collegati.length > 1) {

                        for (c = 0; c < azioni.length; c++) {

                            if (lista2[a].id === azioni[c].id) {

                                var ingre = azioni[c];
                                var iddo = ingre.id;

                                azioni[c].id = ingre.id;

                                for (b = 1; b < lista2[a].nodi_collegati.length; b++) {

                                    ver = {
                                        id: iddo + "_" + (b),
                                        nome: ingre.nome
                                    };

                                    azioni.push(ver);
                                }
                            }
                        }
                    }
                }

                //per i link source
                for (a = 0; a < lista2.length; a++) {
                    let b = 0;

                    if (lista2[a].nodi_collegati.length > 1) {

                        for (c = 0; c < link.length; c++) {

                            if (lista2[a].id === link[c].source) {

                                if (b > 0) {

                                    link[c].source = link[c].source + "_" + (b);
                                }

                                b++;
                            }
                        }
                    }
                }

                // riempio un'altra volta la lista principale
                //  così da poterci lavorare meglio
                lista_adj = [];

                // per gli ingredienti
                for (a = 0; a < ingredienti_totali.length; a++) {

                    riempi = {
                        id: ingredienti_totali[a].id,
                        nodi_collegati: [],
                        num_archi_fino_a_qui: 0
                    };

                    lista_adj.push(riempi);
                }
                // per le azioni
                for (a = 0; a < azioni.length; a++) {

                    riempi = {
                        id: azioni[a].id,
                        nodi_collegati: [],
                        num_archi_fino_a_qui: 0
                    };

                    lista_adj.push(riempi);
                }
                // per i link
                for (a = 0; a < lista_adj.length; a++) {

                    for (b = 0; b < link.length; b++) {

                        if (lista_adj[a].id === link[b].source) {

                            lista_adj[a].nodi_collegati.push(link[b].target);
                        }
                    }
                }

                // riempio la lista dei cammini
                for (a = 0; a < lista_adj.length; a++) {

                    lista_cammini[a] = 1;
                }

                // questa è la funzione ricorsiva che mi dice come arrivo al nodo finale 
                function calcola_cammino(nodo) {

                    let numero = 1;

                    for (w = 0; w < link.length; w++) {

                        if (nodo === link[w].source) {

                            numero = 1 + calcola_cammino(link[w].target);
                        }
                    }

                    return numero;
                }

                // riempio la mia lista per ogni nodo con
                //  il cammino più lungo fino alla fine
                // e infine cerco il cammino più lungo tra tutt i nodi,
                //  che sarà anche la alrghezza del mio grafo
                for (a = 0; a < lista_adj.length; a++) {

                    if (lista_adj[a].nodi_collegati !== []) {

                        for (b = 0; b < lista_adj[a].nodi_collegati.length; b++) {

                            lista_cammini[a] =
                                calcola_cammino(lista_adj[a].nodi_collegati[b]);

                            lista_adj[a].num_archi_fino_a_qui = lista_cammini[a];
                            if (lista_cammini[a] > max_cammino) {
                                max_cammino = lista_cammini[a];
                            }
                        }
                    }
                }

                // inizializzo tutti i nodi a posizione (1,1)
                for (a = 0; a < lista_adj.length; a++) {
                    varf = { id: lista_adj[a].id, posx: 1, posy: 1 };
                    lista_inseriti.push(varf);
                }

                // richiamo la funzione che mi inserisce la posizione
                //  dei nodi in base alla loro distanza dall ultimo nodo,
                //  questa posizioneverrà aggiornata con riordine_nodi()
                posizionamento_nodi_iniziale();

                // richiamo la funzione che riempie l'array dei nodi di intermezzo
                nodi_noTarget();

                // richiamo la funzione che elimina gli spazio vuoti creati dell'inserimento
                // dei nodi di intermezzo
                elimina_spazi_vuoti();

                // richiamo la funzione che riordina i nodi
                //  così da avere dei collegamenti chiari
                riordine_nodi();

                // richiamo la funzione che mi serve per disporre i nodi degli ingredienti
                // precondizioni che non sono target di nessuno
                disposizione_nodi_ingredienti_precondizioni_noTarget();

                // richiamo la funzione per riunire i nodi sdoppiati
                riunisci_nodi_sdoppiati();

                // richiamo la funzione per agiungere i link fisici
                creazione_collegamenti();

                // richiamo la funzione per aggiungere i nodi fisici
                creazione_elementi_SVG();

                // richiamo la funzione per inserire il testo
                inserimento_testo();

                // questo mi serve per far apparire i modali
                $(document).ready(function () {
                    $('[data-toggle="popover"]').popover({
                        placement: 'top',
                        trigger: 'hover'
                    });
                });

                grafico = svgPanZoom(svgElement);
                grafico.zoomAtPoint(1.5, {x: 0, y: 0})

            }
        });
    } else {

        // creo una lista di adiacenza per ogni nodo per
        //  vedere quanti controlli devo fare
        var riempi = {};

        // inserisco ogni ingrediente i nodi collegati e il numero di archi
        //  fino a qui per ora saranno 0 visto non ho ancora cercato nulla
        for (a = 0; a < ingredienti_totali.length; a++) {

            riempi = {
                id: ingredienti_totali[a].id,
                nodi_collegati: [],
                num_archi_fino_a_qui: 0
            };

            lista_adj.push(riempi);
        }

        // inserisco ogni azione i nodi collegati e il numero di archi fino a qui
        // per ora saranno 0 visto non ho ancora cercato nulla
        for (a = 0; a < azioni.length; a++) {

            riempi = {
                id: azioni[a].id,
                nodi_collegati: [],
                num_archi_fino_a_qui: 0
            };

            lista_adj.push(riempi);
        }
        // inserisco i nodi collegati per ogni nodo,
        //  che sarebbero sicuramente più di uno in un array
        for (a = 0; a < lista_adj.length; a++) {

            for (b = 0; b < link.length; b++) {

                if (lista_adj[a].id === link[b].source) {

                    lista_adj[a].nodi_collegati.push(link[b].target);
                }
            }
        }

        // per gli ingredienti
        // per ogni nodo nella lista, se questo è un ingrediente 
        // oltre che a sdoppiarlo nella lista,
        // devo anche sdoppiarlo nella lista degli ingredienti
        for (a = 0; a < lista2.length; a++) {

            // se il mio nodo ha più di un collegamento
            if (lista2[a].nodi_collegati.length > 1) {

                // vado a cercare il corrispondente nodo nella lista 
                // degli ingredienti
                for (c = 0; c < ingredienti_totali.length; c++) {

                    if (lista2[a].id === ingredienti_totali[c].id) {

                        var ingre = ingredienti_totali[c];
                        var iddo = ingre.id;

                        // e lo aggiungo in ingredienti totali
                        ingredienti_totali[c].id = iddo;

                        for (b = 1; b < lista2[a].nodi_collegati.length; b++) {

                            ver = {
                                id: iddo + "_" + (b),
                                nome: ingre.nome,
                                quantita: ingre.quantita
                            };

                            ingredienti_totali.push(ver);
                        }
                    }
                }
            }
        }

        //per le azioni
        // per ogni nodo nella lista, se questo è un' azione 
        // oltre che a sdoppiarlo nella lista,
        // devo anche sdoppiarlo nella lista delle azioni
        for (a = 0; a < lista2.length; a++) {

            if (lista2[a].nodi_collegati.length > 1) {

                for (c = 0; c < azioni.length; c++) {

                    if (lista2[a].id === azioni[c].id) {

                        var ingre = azioni[c];
                        var iddo = ingre.id;

                        azioni[c].id = ingre.id;

                        for (b = 1; b < lista2[a].nodi_collegati.length; b++) {

                            ver = {
                                id: iddo + "_" + (b),
                                nome: ingre.nome
                            };

                            azioni.push(ver);
                        }
                    }
                }
            }
        }

        //per i link source
        for (a = 0; a < lista2.length; a++) {
            let b = 0;

            if (lista2[a].nodi_collegati.length > 1) {

                for (c = 0; c < link.length; c++) {

                    if (lista2[a].id === link[c].source) {

                        if (b > 0) {

                            link[c].source = link[c].source + "_" + (b);
                        }

                        b++;
                    }
                }
            }
        }

        // riempio un'altra volta la lista principale
        //  così da poterci lavorare meglio
        lista_adj = [];

        // per gli ingredienti
        for (a = 0; a < ingredienti_totali.length; a++) {

            riempi = {
                id: ingredienti_totali[a].id,
                nodi_collegati: [],
                num_archi_fino_a_qui: 0
            };

            lista_adj.push(riempi);
        }
        // per le azioni
        for (a = 0; a < azioni.length; a++) {

            riempi = {
                id: azioni[a].id,
                nodi_collegati: [],
                num_archi_fino_a_qui: 0
            };

            lista_adj.push(riempi);
        }
        // per i link
        for (a = 0; a < lista_adj.length; a++) {

            for (b = 0; b < link.length; b++) {

                if (lista_adj[a].id === link[b].source) {

                    lista_adj[a].nodi_collegati.push(link[b].target);
                }
            }
        }

        // riempio la lista dei cammini
        for (a = 0; a < lista_adj.length; a++) {

            lista_cammini[a] = 1;
        }

        // questa è la funzione ricorsiva che mi dice come arrivo al nodo finale 
        function calcola_cammino(nodo) {

            let numero = 1;

            for (w = 0; w < link.length; w++) {

                if (nodo === link[w].source) {

                    numero = 1 + calcola_cammino(link[w].target);
                }
            }

            return numero;
        }

        // riempio la mia lista per ogni nodo con
        //  il cammino più lungo fino alla fine
        // e infine cerco il cammino più lungo tra tutt i nodi,
        //  che sarà anche la alrghezza del mio grafo
        for (a = 0; a < lista_adj.length; a++) {

            if (lista_adj[a].nodi_collegati !== []) {

                for (b = 0; b < lista_adj[a].nodi_collegati.length; b++) {

                    lista_cammini[a] =
                        calcola_cammino(lista_adj[a].nodi_collegati[b]);

                    lista_adj[a].num_archi_fino_a_qui = lista_cammini[a];
                    if (lista_cammini[a] > max_cammino) {
                        max_cammino = lista_cammini[a];
                    }
                }
            }
        }

        // inizializzo tutti i nodi a posizione (1,1)
        for (a = 0; a < lista_adj.length; a++) {
            varf = { id: lista_adj[a].id, posx: 1, posy: 1 };
            lista_inseriti.push(varf);
        }
        // richiamo la funzione che mi inserisce la posizione
        //  dei nodi in base alla loro distanza dall ultimo nodo,
        //  questa posizioneverrà aggiornata con riordine_nodi()
        posizionamento_nodi_iniziale();

        // richiamo la funzione che riempie l'array dei nodi di intermezzo
        nodi_noTarget();

        // richiamo la funzione che elimina gli spazio vuoti creati dell'inserimento
        // dei nodi di intermezzo
        elimina_spazi_vuoti();

        // richiamo la funzione che riordina i nodi
        //  così da avere dei collegamenti chiari
        riordine_nodi();

        // richiamo la funzione che mi serve per disporre i nodi degli ingredienti
        // precondizioni che non sono target di nessuno
        disposizione_nodi_ingredienti_precondizioni_noTarget();

        // richiamo la funzione per riunire i nodi sdoppiati
        riunisci_nodi_sdoppiati();

        // richiamo la funzione per agiungere i link fisici
        creazione_collegamenti();

        // richiamo la funzione per aggiungere i nodi fisici
        creazione_elementi_SVG();

        // richiamo la funzione per inserire il testo
        inserimento_testo();

        


        // questo mi serve per far apparire i modali
        $(document).ready(function () {
            $('[data-toggle="popover"]').popover({
                placement: 'top',
                trigger: 'hover'
            });
        });

        grafico = svgPanZoom(svgElement);
        grafico.zoomAtPoint(1.5, {x: 0, y:0})

    }

    // queste vanno ad aggiornare la lista delle componenti 
    // globali in base al nome vado ad aggiornare il tutto
    /*
    for (d = 0; d < ingredienti_totali.length; d++) {

        let inserisci_global = true;

        ingredienti_globali = JSON.parse(sessionStorage.getItem("ingredienti_global"));

        for (b = 0; b < ingredienti_globali.length; b++) {

            if (ingredienti_globali[b].nome.replace(/\s+/g, '') === ingredienti_totali[d].nome.replace(/\s+/g, '')) {

                inserisci_global = false;
                if (ingredienti_globali[b].immagine !== "") {

                    ingredienti_totali[d].immagine = ingredienti_globali[b].immagine;

                }
            }
        }

        if (inserisci_global) {

            vara_glob = { nome: ingredienti_totali[d].nome, immagine: ingredienti_totali[d].immagine };

            ingredienti_globali.push(vara_glob);

            sessionStorage.setItem("ingredienti_global", JSON.stringify(ingredienti_globali));

            $.ajax({
                url: 'aggiungi_ingrediente_globale.php',
                async: false,
                type: 'POST',
                data: vara_glob
            });
        }
    }*/
}



