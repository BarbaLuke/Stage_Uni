<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// questo è il nome in input dall'utente
$nome = $_POST['nome'];

// questa è la quantità in input dall'utente
$quantita = $_POST['quantita'];

// questo è l'id che servirà per trovare l'ingrediente
$id = $_POST['id'];

// creo l'oggetto che mi permette di manipolare l'XML più facilmente
$doc = new DOMDocument;
$doc->load('ricette/' . $ricetta);
$elemento = $doc->documentElement;

// prendo tutti gli elementi che hanno come tag INGREDIENTE
$ingrediente = $elemento->getElementsByTagName('INGREDIENTE');

// ricerco l'elemento che voglio modificare
foreach ($ingrediente as $child1) {

    $attributo_ID = $child1->getAttribute("IDingrediente");

    if ($attributo_ID == $id) {

        $child1->getElementsByTagName('NOMEING')->item(0)->nodeValue = $nome;
        
        $child1->getElementsByTagName('QUANTITA')->item(0)->nodeValue = $quantita;
    }
}

// salvo tutto nel file
$doc->save("ricette/" . $ricetta);

exit;
?>