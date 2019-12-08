<?php
$ricetta = $_POST['ricetta'];
// questo è il nome in input dall'utente
$idazione = $_POST['id_az'];

$condizione = $_POST['condizione'];


$doc = new DOMDocument;
$doc->load('ricette/' . $ricetta);
$elemento = $doc->documentElement;

$azione = $elemento->getElementsByTagName('AZIONE');

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
