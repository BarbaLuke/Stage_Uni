<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// questo è il nome in input dall'utente
$nome = $_POST['nome'];

// questa è la durata in input dall'utente
$durata = $_POST['durata'];

// questa è la condizione in input dall'utente
$condizione = $_POST['condizione'];

// questo è l'id che servirà per trovare l'azione 
$id = $_POST['id'];

// creo l'oggetto che mi permette di manipolare l'XML più facilmente
$doc = new DOMDocument;
$doc->load('ricette/' . $ricetta);
$elemento = $doc->documentElement;

// prendo tutti gli elementi che hanno come tag AZIONE
$azione = $elemento->getElementsByTagName('AZIONE');

// ricerco l'elemento che voglio modificare cioè nome e/o condizione
foreach ($azione as $child1) {
    $attributo_ID = $child1->getAttribute("IDazione");
    if ($attributo_ID == $id) {
        $child1->getElementsByTagName('NOMEA')->item(0)->nodeValue = $nome;

        if ($condizione !== "") {

            $child1->getElementsByTagName('CONDIZIONE')->item(0)->nodeValue = $condizione;
        }
    }
}

// salvo tutto nel file
$doc->save("ricette/" . $ricetta);

// una volta finita la modifica di quel tipo ricarico di nuovo l'XML
$xmldata = simplexml_load_file("ricette/" . $ricetta) or die("Failed to load");



// questa funzione mi permette di inserire il mio nodo proprio dopo l'elemento
// che mi interessa cioè inserisco $insert subito dopo $target
function simplexml_insert_after(SimpleXMLElement $insert, SimpleXMLElement $target)
{
    $target_dom = dom_import_simplexml($target);
    $insert_dom = $target_dom->ownerDocument->importNode(dom_import_simplexml($insert), true);
    if ($target_dom->nextSibling) {
        return $target_dom->parentNode->insertBefore($insert_dom, $target_dom->nextSibling);
    } else {
        return $target_dom->parentNode->appendChild($insert_dom);
    }
}

// devo inserire i tag nel caso in cui non ci siano
// nel caso in cui voglia inserire durata
if ($durata !== "") {

// questo è l'elemento che funge da appendino, l'elemento precedentemente creato andrà a collocarsi subito dopo
// dovendo inserire la durata, basta cercare l'azione corrispondente
    $target = current($xmldata->xpath('//AZIONE[@IDazione="' . $id . '"]/DUREVOLE'));

// se non esiste il tag DUREVOLE 
    if ($target == false) {

// cambio il $target per inserire il nuovo tag        
        $target = current($xmldata->xpath('//AZIONE[@IDazione="' . $id . '"]/NOMEA'));

// in base alle info inerite dall'utente creo l'elemento da inserire         
        $insert = new SimpleXMLElement('<DUREVOLE>' . $durata . '</DUREVOLE>');

// richiamo la funzione per l'inserimento
        simplexml_insert_after($insert, $target);

// salvo tutto nel file
        $xmldata->asXML("ricette/" . $ricetta);

// questa serie di funzioni servono a sistemare la formattazione meglio
        $dom = dom_import_simplexml($xmldata)->ownerDocument;
        $dom->formatOutput = true;
        $dom->preserveWhiteSpace = false;
        $dom->loadXML($dom->saveXML());
        $dom->save("ricette/" . $ricetta);

// nel caso in cui invece il tag DUREVOLE esistesse        
    } else {

// creo l'oggetto che mi permette di manipolare l'XML più facilmente
        $doc = new DOMDocument;
        $doc->load('ricette/' . $ricetta);
        $elemento = $doc->documentElement;

// prendo tutti gli elementi che hanno come tag AZIONE
        $azione = $elemento->getElementsByTagName('AZIONE');

// ricerco l'elemento che voglio modificare
        foreach ($azione as $child1) {

            $attributo_ID = $child1->getAttribute("IDazione");

            if ($attributo_ID == $id) {

                $child1->getElementsByTagName('DUREVOLE')->item(0)->nodeValue = $durata;
            }
        }
        
        // salvo tutto nel file
        $doc->save("ricette/" . $ricetta);
    }
}
exit;
