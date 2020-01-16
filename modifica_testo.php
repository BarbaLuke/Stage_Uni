<?php
$ricetta = $_POST['ricetta'];
// questo è l'id che ho nascosto all'utente che servirà per trovare 
$testo = $_POST['testone'];
$doc = new DOMDocument;
$doc->load('ricette/' . $ricetta);
$elemento = $doc->documentElement;

$nodo= $elemento->getElementsByTagName('TESTO');

// con un ciclo for cerco l'ingrediente giusto per poterlo modificare
foreach ($nodo as $child1) {
    $child1->nodeValue = $testo;
}

// salvo tutto nel file
$doc->save("ricette/" . $ricetta);
exit;
?>