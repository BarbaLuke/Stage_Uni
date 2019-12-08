<?php
$ricetta = $_POST['ricetta'];
// questo è il nome in input dall'utente
$nome = $_POST['nome'];
// questa è la quantità in input dall'utente
$durata = $_POST['durata'];

$condizione = $_POST['condizione'];
// questo è l'id che ho nascosto all'utente che servirà per trovare 
$id = $_POST['id'];
// creo l'oggetto che mi permette di manipolare l'XML più facilmente
$doc = new DOMDocument;
$doc->load('ricette/' . $ricetta);
$elemento = $doc->documentElement;



$azione = $elemento->getElementsByTagName('AZIONE');


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

$xmldata = simplexml_load_file("ricette/" . $ricetta) or die("Failed to load");

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
if ($durata !== "") {
    $target = current($xmldata->xpath('//AZIONE[@IDazione="' . $id . '"]/DUREVOLE'));

    if ($target == false) {

        $target = current($xmldata->xpath('//AZIONE[@IDazione="' . $id . '"]/NOMEA'));
        $insert = new SimpleXMLElement('<DUREVOLE>' . $durata . '</DUREVOLE>');
        // richiamo la funzione per l'inserimento
        simplexml_insert_after($insert, $target);
        // salvo tutto nel file
        $xmldata->asXML("ricette/" . $ricetta);

        // questa serie di funzioni servono a sistemare la formattazione 
        $dom = dom_import_simplexml($xmldata)->ownerDocument;
        $dom->formatOutput = true;
        $dom->preserveWhiteSpace = false;
        $dom->loadXML($dom->saveXML());
        $dom->save("ricette/" . $ricetta);
    } else {
        $doc = new DOMDocument;
        $doc->load('ricette/' . $ricetta);
        $elemento = $doc->documentElement;



        $azione = $elemento->getElementsByTagName('AZIONE');

        // con un ciclo for cerco l'ingrediente giusto per poterlo modificare
        foreach ($azione as $child1) {
            $attributo_ID = $child1->getAttribute("IDazione");
            if ($attributo_ID == $id) {

                $child1->getElementsByTagName('DUREVOLE')->item(0)->nodeValue = $durata;
                // salvo tutto nel file

            }
        }
        // salvo tutto nel file
        $doc->save("ricette/" . $ricetta);
    }
}
exit;
