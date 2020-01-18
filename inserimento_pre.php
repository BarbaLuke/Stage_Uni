<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// questo è l'id dell'azione da modificare
$idazione = $_POST['idazione'];

// questo è l'id dell'ingrediente da inserire
$idingrediente = $_POST['idingrediente'];

// questo è il nome dell'ingrediente da inserire
$nomeingrediente = $_POST['nomeingrediente'];

// questo è la quantità dell'ingrediente da inserire
$quantita = $_POST['quantita'];

// questo è la quantità dell'ingrediente, usata solo nell'azione, da inserire
$quantusata = $_POST['quantusata'];

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
$insert = new SimpleXMLElement('<INGREDIENTE IDingrediente="'.$idingrediente.'"><NOMEING> '.$nomeingrediente.' </NOMEING><QUANTITA> '.$quantita.' </QUANTITA></INGREDIENTE>');

// questo è l'elemento che funge da appendino, l'elemento precedentemente creato andrà a collocarsi subito dopo
// dovendo inserire un'azione, basta cercare l'ultimo ingrediente del tag PRE dentro l'azione scelta
$target = current($xmldata->xpath('//AZIONE[@IDazione="'.$idazione.'"]/PRE/INGREDIENTE[last()]'));

// se non esiste il tag PRE dentro l'azione scelta allora devo cambiare sia quello che inserisco che la ricerca 
// dell'elemento
if($target === false){
    
    $target = current($xmldata->xpath('//AZIONE[@IDazione="'.$idazione.'"]/NOMEA'));

    $insert = new SimpleXMLElement('<PRE><INGREDIENTE IDingrediente="'.$idingrediente.'"><NOMEING> '.$nomeingrediente.' </NOMEING><QUANTITA> '.$quantita.' </QUANTITA></INGREDIENTE></PRE>');
}

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
