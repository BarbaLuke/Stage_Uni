<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// questo è il testo da modificare
$testo = $_POST['testone'];

// creo l'oggetto che mi permette di manipolare l'XML più facilmente
$doc = new DOMDocument;
$doc->load('ricette/' . $ricetta);
$elemento = $doc->documentElement;

// prendo tutti gli elementi che hanno come tag TESTO
$nodo= $elemento->getElementsByTagName('TESTO');

// ricerco l'elemento che voglio modificare
foreach ($nodo as $child1) {
    $child1->nodeValue = $testo;
}

// salvo tutto nel file
$doc->save("ricette/" . $ricetta);
exit;
?>