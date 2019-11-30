var nodi_spostati = [];

// inserisco la posizione di ogni nodo
function posizionamento_nodi_iniziale() {

    for (a = 0; a < lista_adj.length; a++) {
        // questa variabile mi serve per posizionare rispetto all'asse delle y
        // la reinizializzo poichè per ogni nodo 
        // (in realtà per ogni valore di archi fino in fondo)
        // avrò bisogno di una variabile nuova

        let y = 1;

        // controllo di non aver già visitato questo nodo
        if (!(lista_nodi.includes(lista_adj[a].id))) {

            // se non è stato visitato allora lo inserisco tra quelli visitati
            lista_nodi.push(lista_adj[a].id);

            // gli do subito la posizione x che dovrei aver calcolato prima

            lista_inseriti[a].posx =
                max_cammino + 2 - lista_adj[a].num_archi_fino_a_qui;

            // quello che faccio qui è un po' ambiguo ma
            //  questo sotto-insieme di operazioni fa la seguente:
            // avendo il numero di archi che arriva fino in fondo, so che
            // la posizione rispetto all'asse delle x è determinata
            //  in funzione di ciò. Quindi ogni nodo che avesse
            //  lo stesso numero di archi che arriva fino alla fine
            // avrà si la stessa posizione x del mio nodo appena trovato
            //  ma posizione verticale differente

            for (b = 0; b < lista_adj.length; b++) {

                // controllo che abbiano lo stesso numero
                //  di archi fino alla fine
                if (lista_adj[a].num_archi_fino_a_qui ===
                    lista_adj[b].num_archi_fino_a_qui) {

                    // aggiorno la variabile per il posizionamento verticale
                    y++;

                    // inserisco il nodo tra quelli già visitati
                    lista_nodi.push(lista_adj[b].id);

                    // assegno il valore giusto per la x e la y
                    lista_inseriti[b].posx =
                        max_cammino + 2 - lista_adj[b].num_archi_fino_a_qui;

                    lista_inseriti[b].posy = y;
                }
            }
        }
    }
}

// questo insieme di operazioni mi serve per disporre i nodi ingredenti
// primari (cioè che non sono target di nessun'altro nodo)
// rispetto al nodo a cui sono collegati
function disposizione_nodi_ingredienti_precondizioni_noTarget() {
    
    for (a = 0; a < lista_inseriti.length; a++) {

        // questa variabile viene inizializzata ad ogni visita ad un nodo 
        // poichè deve essere incrementata per ogni nodo ingrediente primario
        // collegato ad esso
        numer = 0;

        // devo cercare tra i link
        for (b = 0; b < link.length; b++) {

            // quando un nodo fa da target allora
            if (lista_inseriti[a].id === link[b].target) {

                // esploro un'altra volta tutti i nodi 
                for (c = 0; c < lista_inseriti.length; c++) {

                    // cercando la source del nodo iniziale
                    if (link[b].source === lista_inseriti[c].id) {

                        // se la source del nodo iniziale è un nodo 
                        // ingrediente primario
                        if (nodi_intermezzo.includes(lista_inseriti[c].id)) {

                            // incremento la variabile perchè ho trovato qualcosa
                            numer++;
                        }
                    }
                }
            }
        }

        //se ho più di tre nodi collegati al nodo che fa da target
        if (numer > 3) {

            // inizializzo la variabile di decisione per lo spostamento del nodo che fa da target
            sposta = false;
            
            // vado a vedere nella lista inseriti
            for (l = 0; l < lista_inseriti.length; l++) {

                // se ho un nodo che non sia un nodo di intermezzo (cioè senza source) che sta nella stessa
                // posizione x ma con posizione y minore cioà sta sopra il nodo che vorrei spostare
                if (lista_inseriti[l].posy < lista_inseriti[a].posy && lista_inseriti[l].posx === lista_inseriti[a].posx && !nodi_intermezzo.includes(lista_inseriti[l].id)) {

                    // setto la variabile di decisione dello spostamento a true
                    sposta = true;

                    // vado a vedere nella lista inseriti 
                    for (t = 0; t < lista_inseriti.length; t++) {

                        // se ho dei nodi come prima che si trovano sulla stessa posizione x
                        // ma si trovano sotto il nodo da spostare
                        if (lista_inseriti[t].posy >= lista_inseriti[a].posy && lista_inseriti[t] !== lista_inseriti[a] && lista_inseriti[t].posx === lista_inseriti[a].posx && !nodi_intermezzo.includes(lista_inseriti[t].id)) {

                            // allora devo spostare anche loro
                            lista_inseriti[t].posy += parseInt(numer / 3);
                            nodi_spostati[nodi_spostati.length] = lista_inseriti[t].id;
                        }
                    }
                }
            }

            // se c'è da spostare il nodo
            if (sposta) {
                // infine sposto il nodo della quantità desiderata
                // per sempilicità ho raggruppato in tre nodi ogni piano dei nodi di intermezzo
                lista_inseriti[a].posy += parseInt(numer / 3);
                nodi_spostati[nodi_spostati.length] = lista_inseriti[a].id;
            }
        }
    }
    // questa serie di funzioni mi serve per non lasciare spaz vuoti nel grafico
    // che risulterebbe di difficile lettura
    // devo ripetere questa serie di azioni per un numero non ben definito di volte
    // ma io ho stabilito un tetto massimo uguale alla lunghezza della lista inseriti
    for (i = 0; i < lista_inseriti.length; i++) {
        // per ogni nodo della lista inseriti
        for (a = 0; a < lista_inseriti.length; a++) {
            // per ogni link 
            for (b = 0; b < link.length; b++) {
                // controllo che il mio nodo sia una source
                if (lista_inseriti[a].id === link[b].source) {

                    // tra tutti i nodi della lista inseriti
                    for (c = 0; c < lista_inseriti.length; c++) {
                        // se trovo il target della mia source
                        if (link[b].target === lista_inseriti[c].id) {

                            // se il nodo source si trova nella posizione prima del nodo 
                            // target rispetto a x e ad una posizione y diversa
                            if (lista_inseriti[a].posx ===
                                (lista_inseriti[c].posx - 1) &&
                                lista_inseriti[a].posy !==
                                lista_inseriti[c].posy) {

                                // setto la variabile che mi permette di spostare il nodo source    
                                let posso = true;

                                // controllo nella lista dei nodi inseriti 
                                for (d = 0; d < lista_inseriti.length; d++) {

                                    // a meno che non esista qualche nodo nella posizione y uguale al nodo 
                                    // target che sarebbe quella dove devo spostare il nodo source
                                    if (lista_inseriti[a].posx ===
                                        lista_inseriti[d].posx &&
                                        lista_inseriti[a].id !==
                                        lista_inseriti[d].id &&
                                        lista_inseriti[c].posy ===
                                        lista_inseriti[d].posy &&
                                        posso) {
                                        // se si verifica che esiste già un nodo dove voglio spostare la source
                                        posso = false;
                                    }
                                }
                                // nel caso in cui non vi sia nessun nodo ad ostacolare lo spostamento
                                if (posso && !nodi_spostati.includes(lista_inseriti[a].id)) {
                                    // allineo i due nodi
                                    lista_inseriti[a].posy = lista_inseriti[c].posy;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // ora devo spostare i nodi di intermezzo nelle posizioni giuste

    for (a = 0; a < lista_inseriti.length; a++) {

        // questa variabile viene inizializzata ad ogni visita ad un nodo 
        // poichè deve essere incrementata per ogni nodo ingrediente primario
        // collegato ad esso
        numer = 0;

        // devo cercare tra i link
        for (b = 0; b < link.length; b++) {

            // quando un nodo fa da target allora
            if (lista_inseriti[a].id === link[b].target) {

                // esploro un'altra volta tutti i nodi 
                for (c = 0; c < lista_inseriti.length; c++) {

                    // cercando la source del nodo iniziale
                    if (link[b].source === lista_inseriti[c].id) {

                        // se la source del nodo iniziale è un nodo 
                        // ingrediente primario
                        if (nodi_intermezzo.includes(lista_inseriti[c].id)) {

                            // incremento la variabile perchè ho trovato qualcosa
                            numer++;
                        }
                    }
                }
            }
        }

        for (b = 0; b < link.length; b++) {

            // quando un nodo fa da target allora
            if (lista_inseriti[a].id === link[b].target) {

                // esploro un'altra volta tutti i nodi 
                for (c = 0; c < lista_inseriti.length; c++) {

                    // cercando la source del nodo iniziale
                    if (link[b].source === lista_inseriti[c].id) {

                        // se la source del nodo iniziale è un nodo 
                        // ingrediente primario
                        if (nodi_intermezzo.includes(lista_inseriti[c].id)) {

                            if (numer <= 3) {

                                // cambio le posizioni del nodo ingrediente primario
                                //  in base alla variabile numer
                                // e alla posizione del nodo a cui è collegato
                                if (((numer / 3) - 0.66) < 0.2 && ((numer / 3) - 0.66) > 0) {

                                    lista_inseriti[c].posx =
                                        lista_inseriti[a].posx;

                                        lista_inseriti[c].posy =
                                    lista_inseriti[a].posy - 0.50;

                                } else {

                                    lista_inseriti[c].posx =
                                        lista_inseriti[a].posx - 0.66 + numer / 3;

                                        lista_inseriti[c].posy =
                                    lista_inseriti[a].posy - 0.35;

                                }

                            } else {

                                if ((((numer - parseInt(numer / 3) * 3) / 3) - 0.66) < 0.2 && (((numer - parseInt(numer / 3) * 3) / 3) - 0.66) > 0) {

                                    lista_inseriti[c].posx =
                                        lista_inseriti[a].posx;

                                } else {

                                    lista_inseriti[c].posx =
                                        lista_inseriti[a].posx - 0.66 + (numer - parseInt(numer / 3) * 3) / 3;

                                }

                                lista_inseriti[c].posy =
                                    lista_inseriti[a].posy - (0.35 * (parseInt(numer / 3) + 1));

                            }
                            numer--;
                        }
                    }
                }
            }
        }
    }
}


// per trovare i nodi di intermezzo cerco in mezzo a tutti
function nodi_noTarget() {
    for (a = 0; a < lista_inseriti.length; a++) {

        // cerco nella lista dei link (anche se in realtà non lo voglio trovare)
        //  l'elemento per cui sia target di qualche altro nodo
        tr = link.find(x => x.target === lista_inseriti[a].id);

        // se la ricerca precedente non è andata a buon fine
        //  allora è il nodo che stavo cercando
        if (typeof tr === "undefined") {

            // il nodo trovato lo distinguo per ora posizionandolo diversamente
            // rispetto all'asse delle x
            lista_inseriti[a].posx = lista_inseriti[a].posx + 0.5;

            // ovviamente lo inserisco pure nella lista nodi giusta
            nodi_intermezzo.push(lista_inseriti[a].id);
        }
    }
}

// riassemblo i nodi sdoppiati in lista_adj    
// questa serie di operazioni mi serve per
// riunire i nodi che ho sdoppiato nel nodo principale
function riunisci_nodi_sdoppiati() {

    for (a = 0; a < lista_adj.length; a++) {

        // nella lista delle adiacenze cerco i nodi replicati 
        if (lista_adj[a].id.includes('_')) {

            // cerco il nodo da cui l'ho capiato
            for (b = 0; b < lista_adj.length; b++) {

                // il nodo da cui l'ho copiato sarà senza il trattino basso
                if (!(lista_adj[b].id.includes('_'))) {

                    // devo capire se è il nodo che cercavo in questo modo:
                    // il nodo principale sarà ad esempio => 1i
                    // il nodo sdoppiato sarà => 1i_1
                    // si può ben vedere come la prima parte della mia stringa
                    // sia uguale per entrambi,
                    // mentre cambia il trattino basso e il numero
                    // nel nodo sdoppiato cerco la prima parte della stringa
                    //  che arrivi fino al trattino
                    barra = lista_adj[a].id.indexOf('_');
                    nodo = lista_adj[a].id.substr(0, barra);

                    // se ho trovato il nodo
                    if (lista_adj[b].id === nodo) {

                        // inserisco come nodo collegato il nodo collegato
                        //  al nodo sdoppiato
                        lista_adj[b].nodi_collegati.
                            push(lista_adj[a].nodi_collegati[0]);

                        // devo infine scegliere quale numero di archi assegnare
                        // scelgo quindi il numero più grande
                        if (lista_adj[a].num_archi_fino_a_qui >
                            lista_adj[b].num_archi_fino_a_qui) {

                            lista_adj[b].num_archi_fino_a_qui =
                                lista_adj[a].num_archi_fino_a_qui;
                        }
                    }
                }
            }
        }
    }
}

// con questa serie di operazioni quello che vado a fare è lo scambio di nodi 
// lo scambio avviene rispetto ai collegamenti di ogni nodo rispetto 
// ai nodi nella stessa posizione x
// non ho ancora capito il perchè, ma la stessa operazione su tutti i nodi 
// deve essere ripetuta un paio di volte 
// (per ora il numero di nodi diviso 2 va bene)
function riordine_nodi() {
    for (p = 0; p < lista_inseriti.length / 2; p++) {

        // come prima per ogni nodo
        for (a = 0; a < lista_inseriti.length; a++) {

            // inizializzo l'array che conterrà, come prima, i nodi nella stessa 
            // posizione rispetto all'asse y
            let arra = [];

            // voglio scambiare le posizioni solo dei nodi
            //  che non sono ingredienti primari    
            let tr = link.find(x => x.target === lista_inseriti[a].id);

            if (typeof tr !== "undefined") {

                // riempio l'array con i nodi nella stessa posizione x
                for (b = 0; b < lista_inseriti.length; b++) {
                    if (lista_inseriti[b].posx === lista_inseriti[a].posx) {
                        arra.push(lista_inseriti[b]);
                    }
                }

                for (c = 0; c < arra.length; c++) {

                    // per ogni nodo nel mio array 
                    // (dei nodi alla stessa posizione)
                    // devo cercare i nodi che abbiano un collegamento
                    let tx = link.find(y => y.source === arra[c].id);

                    if (typeof tx !== "undefined") {

                        for (d = 0; d < arra.length; d++) {

                            // per ogni nodo eseguo un controllo a coppie 
                            // vado a controllare per ognuno il nodo
                            //  a cui è collegato
                            let ty = link.find(j => j.source === arra[d].id);

                            if (typeof ty !== "undefined") {

                                // vado a cercare nella lista principale
                                //  l'id del nodo a cui i nodi
                                //  che sto controllando sono collegati
                                // così da poter confrontare le proprietà
                                let th2 = lista_inseriti.
                                    find(k => k.id === ty.target);
                                let th1 = lista_inseriti.
                                    find(z => z.id === tx.target);

                                // le condizioni per cui
                                // effettuo lo scambio di posizione 
                                // rispetto alla posizione y sono le seguenti:
                                // - la posizione del nodo source è_
                                // maggiore del nodo target e_
                                // la posizione del secondo nodo source è_
                                // minore del nodo target;
                                // - il contrario di quella precedente;
                                // - la posizione del nodo source è_
                                //  maggiore di più di una posizione_
                                //  rispetto alla posizione del nodo target e_
                                // la posizione del secondo nodo source è_
                                // la stessa del nodo target e_
                                // e il secondo nodo target è_
                                // maggiore rispetto alla posizione
                                // del primo nodo target;
                                // - il contrario della proecedente;
                                if ((arra[c].posy > th1.posy &&
                                    arra[d].posy < th2.posy) ||
                                    (arra[d].posy > th2.posy &&
                                        arra[c].posy < th1.posy) ||
                                    (arra[c].posy > th1.posy + 1 &&
                                        arra[d].posy === th2.posy &&
                                        th2.posy > th1.posy) ||
                                    (arra[c].posy < th1.posy - 1 &&
                                        arra[d].posy === th2.posy &&
                                        th2.posy < th1.posy)) {

                                    //a questo punto eseguo lo scambio
                                    let tempo = arra[c].posy;
                                    arra[c].posy = arra[d].posy;
                                    arra[d].posy = tempo;
                                }
                            }
                        }
                    }

                    // effettuati gli scambi faccio gli aggiornamenti
                    // nella lista principale
                    for (e = 0; e < lista_inseriti.length; e++) {
                        if (arra[c].id === lista_inseriti[e].id) {
                            lista_inseriti[e] = arra[c];
                        }
                    }
                }
            }
        }
    }

    // per gli ingredienti, basta solo eliminare quelli sdoppiati
    for (a = 0; a < ingredienti_totali.length; a++) {

        if (ingredienti_totali[a].id.includes('_')) {

            ingredienti_totali.splice(a, 1);
            a--;
        }
    }

    // stessa cosa per le azioni
    for (a = 0; a < azioni.length; a++) {

        if (azioni[a].id.includes('_')) {

            azioni.splice(a, 1);
            a--;
        }
    }

    // stessa cosa per la lista degli inseriti
    for (a = 0; a < lista_inseriti.length; a++) {

        if (lista_inseriti[a].id.includes('_')) {

            lista_inseriti.splice(a, 1);
            a--;
        }
    }

    // stessa cosa per la lista iniziale
    for (a = 0; a < lista_adj.length; a++) {

        if (lista_adj[a].id.includes('_')) {

            lista_adj.splice(a, 1);
            a--;
        }
    }

    //per i link invece devo andare a cercare in 
    // ingredienti o azioni quella corrispondente
    for (a = 0; a < link.length; a++) {

        // cerco le source con il trattino basso (nodi sdoppiati)
        if (link[a].source.includes('_')) {

            // vado a cercare di capire se sia un ingrediente o un'azione
            for (b = 0; b < ingredienti_totali.length; b++) {

                // come prima vado a confrontare le stringhe
                // senza il trattino e il numero 
                let barra = link[a].source.indexOf('_');
                let nodo = link[a].source.substr(0, barra);

                // alla fine scambio
                if (ingredienti_totali[b].id === nodo) {

                    link[a].source = ingredienti_totali[b].id;
                }
            }

            // stesse cose per il controllo delle azioni
            for (c = 0; c < azioni.length; c++) {

                let barra = link[a].source.indexOf('_');
                let nodo = link[a].source.substr(0, barra);

                if (azioni[c].id === nodo) {

                    link[a].source = azioni[c].id;
                }
            }
        }

        // qui invece controllo i target ma le funzioni sono identiche alla 
        // ricerca delle source
        if (link[a].target.includes('_')) {

            for (b = 0; b < ingredienti_totali.length; b++) {

                let barra = link[a].target.indexOf('_');
                let nodo = link[a].target.substr(0, barra);

                if (ingredienti_totali[b].id === nodo) {

                    link[a].target = ingredienti_totali[b].id;
                }
            }

            for (c = 0; c < azioni.length; c++) {

                let barra = link[a].target.indexOf('_');
                let nodo = link[a].target.substr(0, barra);

                if (azioni[c].id === nodo) {

                    link[a].target = azioni[c].id;
                }
            }
        }
    }

    // per allineare i nodi
    for (i = 0; i < lista_inseriti.length; i++) {
        for (a = 0; a < lista_inseriti.length; a++) {
            for (b = 0; b < link.length; b++) {
                if (lista_inseriti[a].id === link[b].source) {

                    for (c = 0; c < lista_inseriti.length; c++) {
                        if (link[b].target === lista_inseriti[c].id) {

                            if (lista_inseriti[a].posx ===
                                (lista_inseriti[c].posx - 1) &&
                                lista_inseriti[a].posy !==
                                lista_inseriti[c].posy) {

                                let posso = true;
                                for (d = 0; d < lista_inseriti.length; d++) {
                                    if (lista_inseriti[a].posx ===
                                        lista_inseriti[d].posx &&
                                        lista_inseriti[a].id !==
                                        lista_inseriti[d].id &&
                                        lista_inseriti[c].posy ===
                                        lista_inseriti[d].posy &&
                                        posso) {
                                        posso = false;
                                    }
                                }
                                if (posso) {
                                    lista_inseriti[a].posy =
                                        lista_inseriti[c].posy;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // con questa serie di funzioni controllo che non ci siano collegamenti sovrapposti

    //devo controllare i nodi a due a due
    for (a = 0; a < lista_inseriti.length; a++) {

        for (z = 0; z < lista_inseriti.length; z++) {

            // se trovo un nodo nella stessa posizione y ma ovviamente diverso da se stesso
            if (lista_inseriti[a].posy === lista_inseriti[z].posy &&
                lista_inseriti[a].id !== lista_inseriti[z].id) {
                // controllo nella lista dei link i target di questi due nodi  
                let uguale1 = [];
                let uguale2 = [];
                for (s = 0; s < link.length; s++) {

                    if (lista_inseriti[a].id === link[s].source) {
                        // in questa variabile inserisco il target del primo nodo
                        uguale1.push(link[s].target);
                    } else if (lista_inseriti[z].id === link[s].source) {
                        // in questa variabile inserisco il target del secondo nodo
                        uguale2.push(link[s].target);
                    }
                }
                // per ogni nodo target del mio nodo source
                for (f = 0; f < uguale1.length; f++) {
                    // stessa cosa qui
                    for (e = 0; e < uguale2.length; e++) {
                        // nel caso in cui i miei due nodi condividano la stessa source 
                        if (uguale1[f] === uguale2[e]) {
                            // essendo sulla stessa y devo spostare un nodo per evitare sovraffollamento di nodi
                            for (n = 0; n < lista_inseriti.length; n++) {
                                // una volta trovato il nodo target                                    
                                if (lista_inseriti[n].id === uguale1[f]) {
                                    // devo controlare che non sia sulla stessa posizione y
                                    if (lista_inseriti[n].posy === lista_inseriti[a].posy
                                        && lista_inseriti[n].id !== lista_inseriti[z].id
                                        && lista_inseriti[n].id !== lista_inseriti[a].id) {
                                        // in caso affermativo devo spostare un nodo di una posizione
                                        lista_inseriti[a].posy += 1;
                                        nodi_spostati.push(lista_inseriti[a].id);
                                        nodi_spostati.push(lista_inseriti[z].id);
                                        // devo stare attento al fatto che non ci siano nodi sotto
                                        // poichè verrebbero sovrapposti malamente
                                        for (u = 0; u < lista_inseriti.length; u++) {
                                            if (lista_inseriti[u].posy >= lista_inseriti[a].posy
                                                && lista_inseriti[u].posx  === lista_inseriti[a].posx
                                                && lista_inseriti[u].id !== lista_inseriti[a].id) {
                                                // a questo punto devo spostare ogni nodo sotto
                                                lista_inseriti[u].posy += 1;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// questo inseme di operazioni mi serve per non avere
// centinaia di posizioni vuote sopra la testa di ogni nodo
function elimina_spazi_vuoti() {
    for (a = 0; a < lista_inseriti.length; a++) {

        // per ogni nodo inizializzo questo array che andrà a contenere
        // tutti i nodi con la stessa posizione rispetto all'asse delle x
        let arra = [];

        // midevo assicurare che non siano nodi di intermezzo quindi eseguo 
        // un controllo per assicurarmi che siano anche target di altri nodi
        let tr = link.find(x => x.target === lista_inseriti[a].id);

        if (typeof tr !== "undefined") {

            // riempio il mio array con i nodi alla stessa posizione x
            for (b = 0; b < lista_inseriti.length; b++) {
                if (lista_inseriti[b].posx === lista_inseriti[a].posx) {
                    arra.push(lista_inseriti[b]);
                }
            }

            // per ogni nodo dentro il mio array vado a riposizionarlo rispetto 
            // all'asse delle y
            for (c = 0; c < arra.length; c++) {

                let possay = arra[c].posy;

                for (d = 1; d < arra[c].posy; d++) {

                    let ty = arra.find(y => y.posy === possay - 1);

                    if (typeof ty === "undefined" && possay) {

                        possay--;
                    }
                }

                arra[c].posy = possay;

                // una volta definite le posizioni y di tutti i nodi con la 
                // stessa posizione y allora posso aggiornarli nella lista 
                // principale (lista_inseriti)
                for (e = 0; e < lista_inseriti.length; e++) {
                    if (lista_inseriti[e].id === arra[c].id && !(nodi_spostati.includes(lista_inseriti[e].id))) {
                        lista_inseriti[e] = arra[c];
                    }
                }
            }
        }
    }
}

/*
// ora devo effettuare gli spostamenti di ogni elemento
// per far risaltare bene i collegamenti e gli elementi
// probabilmente questa funzione è inutile
function spostamenti_risaltare_colegamenti(){
for(a=0;a<lista_inseriti.length;a++){
    // inizializzo questo elemento per ogni nodo per verificare se
    // il nodo che sto esplorando sia il target di un nodo di intermezzo
    bah=0;
    for(b=0;b<link.length;b++){
        // mi assicuro che sia un target
        if(lista_inseriti[a].id === link[b].target){
            for(c=0;c<lista_inseriti.length;c++){
                // cerco la source
                if(link[b].source === lista_inseriti[c].id){
                    if(nodi_intermezzo.includes(lista_inseriti[c].id)){
                        // se la source del nodo che stiamo esplorando è
                        // un nodo di intermezzo setto a uno la variabile
                        bah=1;
                    }
                }
            }
        }
    }
    // verifico che il nodo abbia una source che sia nei nodi di intermezzo
    if(bah===1){
        // devo effettuare degli spostamenti di posizione per ogni nodo coinvolto
        for(d=0;d<lista_inseriti.length;d++){
            if(lista_inseriti[a].posy >1){
                // se il nodo si trova alla stessa posizione x ma con posizione y maggiore
                if(lista_inseriti[d].posx === lista_inseriti[a].posx && lista_inseriti[d].posy > lista_inseriti[a].posy){
                    // sposto il nodo di 0.5 in y
                    lista_inseriti[d].posy+=0;
                }
            }
            // se invece il nodo si trova ad una posizione x maggiore rispetto al nodo che sto visitando
            //  e abbiano id differenti
            if(lista_inseriti[d].posx > lista_inseriti[a].posx && lista_inseriti[d].id !== lista_inseriti[a].id){
                // sposto il nodo di 0.5 in x
                lista_inseriti[d].posx+=0;
            }
        }
        // infine eseguo gli spostamenti del nodo che stavo visitando
        // lo sposto 0.5 in x
        lista_inseriti[a].posx+=0;
        // e se non si trova in prima posizione
        if(lista_inseriti[a].posy >1){
            // lo sposto di 0.5 in y
            lista_inseriti[a].posy+=0;
        }
    }
}
}

 */


