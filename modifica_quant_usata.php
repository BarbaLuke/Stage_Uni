<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// questo è l'id che servirà per trovare l'azione 
$idazione = $_POST['id_az'];

// questo è l'id che servirà per trovare l'ingrediente
$idingrediente = $_POST['id_in'];

// questa è la quantità usata in input dall'utente
$quant_usata = $_POST['quantita'];

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

// l'elemento che devo inserire, in questo caso è solo l'ingrediente, varia in base
// ai parametri passati in input dall'utente
$insert = $quant_usata;


// l'elemento che funge da appendino, in questo caso dovendo aggiungere solo 
// un ingrediente quindi mi basta trovare l'ultimo elemento degli ingredienti
// gli ingredienti dentro le azioni non li vede perchè sono nodi figli di nodi figli
$target = current($xmldata->xpath('//AZIONE[@IDazione="'.$idazione.'"]/PRE/QUANTUSATA[@IDingrediente="'.$idingrediente.'"]'));

// se non fosse dentro i tag di PRE
if($target === false){

    $target = current($xmldata->xpath('//AZIONE[@IDazione="'.$idazione.'"]/POST/QUANTUSATA[@IDingrediente="'.$idingrediente.'"]'));

// se non esistesse infine il tag QUANTUSATA
    if($target === false){

        $target = current($xmldata->xpath('//AZIONE[@IDazione="'.$idazione.'"]/PRE/INGREDIENTE[@IDingrediente="'.$idingrediente.'"]'));

// se l'ingrediente non fosse dentro i PRE
        if($target === false){

            $target = current($xmldata->xpath('//AZIONE[@IDazione="'.$idazione.'"]/POST/INGREDIENTE[@IDingrediente="'.$idingrediente.'"]'));

        }

// in base alle info inerite dall'utente creo l'elemento da inserire  
        $insert = new SimpleXMLElement('<QUANTUSATA IDingrediente="'.$idingrediente.'">'.$quant_usata.'</QUANTUSATA>');

    }
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
