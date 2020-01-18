<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// questo è l'id nuovo da inserire
$id = $_POST['id'];

// questo è il nome in input dall'utente
$nome = $_POST['nome'];

// questa è la durata
$durata = $_POST['durata'];

// questa è la condizione
$condizione = $_POST['condizione'];

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
if($durata !== "" ){

    $insert = new SimpleXMLElement('<AZIONE IDazione="'.$id.'"><NOMEA> '.$nome.' </NOMEA><DUREVOLE>'.$durata.'</DUREVOLE><CONDIZIONE>'.$condizione.'</CONDIZIONE></AZIONE>');
}else{

    $insert = new SimpleXMLElement('<AZIONE IDazione="'.$id.'"><NOMEA> '.$nome.' </NOMEA><CONDIZIONE>'.$condizione.'</CONDIZIONE></AZIONE>');

}
    

// questo è l'elemento che funge da appendino, l'elemento precedentemente creato andrà a collocarsi subito dopo
// dovendo inserire un'azione, basta cercare l'ultima azione
$target = current($xmldata->xpath('//AZIONE[last()]'));

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
