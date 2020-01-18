<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// questo è l'id nuovo da inserire
$id = $_POST['id'];

// questo è il nome in input dall'utente
$nome = $_POST['nome'];

// questa è la quantità in input dall'utente
$quantita = $_POST['quantita'];

// creo l'oggetto simplexml che mi permette di manipolare l'XML più facilmente
$xmldata = simplexml_load_file("ricette/".$ricetta) or die("Failed to load");

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

// in base alle info inerite dall'utente creo l'elemento da inserire 
if($quantita !== ""){
    $insert = new SimpleXMLElement('<INGREDIENTE IDingrediente="'.$id.'"><NOMEING> '.$nome.' </NOMEING><QUANTITA> ' .$quantita. ' </QUANTITA></INGREDIENTE>');
}else{
    $insert = new SimpleXMLElement('<INGREDIENTE IDingrediente="'.$id.'"><NOMEING> '.$nome.' </NOMEING></INGREDIENTE>');
}

// questo è l'elemento che funge da appendino, l'elemento precedentemente creato andrà a collocarsi subito dopo
// dovendo inserire un'azione, basta cercare l'ultimo ingrediente
$target = current($xmldata->xpath('//INGREDIENTE[last()]'));

// richiamo la funzione per l'inserimento
simplexml_insert_after($insert, $target);

// salvo tutto nel file
$xmldata->asXML("ricette/".$ricetta);

// questa serie di funzioni servono a sistemare la formattazione meglio
$dom = dom_import_simplexml($xmldata)->ownerDocument;
$dom->formatOutput = true;
$dom->preserveWhiteSpace = false;
$dom->loadXML( $dom->saveXML());
$dom->save("ricette/".$ricetta);

exit;
?>
