<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// questo è l'id che servirà per trovare l'azione 
$idazione = $_POST['id_az'];

// questa è la condizione in input dall'utente
$condizione = $_POST['condizione'];

// creo l'oggetto che mi permette di manipolare l'XML più facilmente
$doc = new DOMDocument;
$doc->load('ricette/' . $ricetta);
$elemento = $doc->documentElement;

// prendo tutti gli elementi che hanno come tag AZIONE
$azione = $elemento->getElementsByTagName('AZIONE');

// ricerco l'elemento che voglio modificare
foreach ($azione as $child1) {

    $attributo_ID = $child1->getAttribute("IDazione");

    if ($attributo_ID == $idazione) {

        if ($condizione !== "") {

            $child1->getElementsByTagName('CONDIZIONE')->item(0)->nodeValue = $condizione;
        }
    }
}

// salvo tutto nel file
$doc->save("ricette/" . $ricetta);

exit;
?>
