<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// questo sarà l'id azione condizione
$idsource = $_POST['source'];

// questo sarà l'id azione durevole
$idtarget = $_POST['target'];

// creo l'oggetto simplexml che mi permette di manipolare l'XML più facilmente
$xmldata = simplexml_load_file("ricette/".$ricetta) or die("Failed to load");

// questa funzione mi permette di inserire il mio nodo proprio dopo l'elemento
// che mi interessa cià inserisco insert subito dopo target
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
$insert = new SimpleXMLElement('<RELAZIONEdiSIMULT IDazioneDurevole="'.$idtarget.'" IDazioneCondizione="'.$idsource.'">&#xA;</RELAZIONEdiSIMULT>');

// questo è l'elemento che funge da appendino, l'elemento precedentemente creato andrà a collocarsi subito dopo
// dovendo inserire una relazione, basta cercare l'ultimo tag delle relazioni di simultaneità
$target = current($xmldata->xpath('//RELAZIONEdiSIMULT[last()]'));

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
