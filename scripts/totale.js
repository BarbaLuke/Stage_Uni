// questo mi serve per il controllo del grafico, in particolare lo zoom
var svgElement = document.getElementById("vedo");
var grafico = 0;
var testo="";
    
// array che conterranno in ordine: INGREDIENTI, POST delle AZIONI e
//  la differenza dei primi due
var ingredienti_totali = [];

// variabile per gli ingerdienti globali
var ingredienti_globali = 
JSON.parse(sessionStorage.getItem("ingredienti_global"));

// arrai che conterrà le azioni
var azioni = [];

// quantità usate di cosa in quale azione
var quantcosa = [];

// variabile per le azioni globali
var azioni_globali = 
JSON.parse(sessionStorage.getItem("azioni_global"));;

// array che contiene i link
var link = [];

// link da aggiungere dopo
var link_dopo = [];

// lista con delle info sui nodi
var lista_adj = [];

// variabili di supporto
var x, i, y, z, j, k, vara, vara2, inno;

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

// questo array conterrà i link (le freccie in realtà) che collegano ogni nodo
// al successivo
var lista_freccie = [];

// questa variabile mi serve per contenere quei nodi che non sono
// target di nessuno cioè sono solo degli input per un determinato nodo
var nodi_intermezzo = [];

//Funzione di richiamo del file xml appena inserito
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        calcolo_nodi_e_link(this);
    }
};

//Utilizzo sessionStorage per trovare il nome del file da aprire
//Questo però funziona solo quando il tab rimane aperto
//Se chiudo il tab la sessione viene automaticamente chiusa
// insieme alla sparizione dei miei dati
xhttp.open("GET", "ricette/" + sessionStorage.getItem("nome_file"), true);
xhttp.send();

document.getElementById("scarico").href = "ricette/" + sessionStorage.getItem("nome_file");
document.getElementById("leggo").href = "ricette/" + sessionStorage.getItem("nome_file");
