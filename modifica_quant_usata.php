<?php
$ricetta = $_POST['ricetta'];
// questo è il nome in input dall'utente
$idazione = $_POST['id_az'];

$idingrediente = $_POST['id_in'];

$quant_usata = $_POST['quantita'];

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

// l'elemento che devo inserire, in questo caso è solo l'ingrediente, varia in base
// ai parametri passati in input dall'utente
$insert = $quant_usata;


// l'elemento che funge da appendino, in questo caso dovendo aggiungere solo 
// un ingrediente quindi mi basta trovare l'ultimo elemento degli ingredienti
// gli ingredienti dentro le azioni non li vede perchè sono nodi figli di nodi figli
$target = current($xmldata->xpath('//AZIONE[@IDazione="'.$idazione.'"]/PRE/QUANTUSATA[@IDingrediente="'.$idingrediente.'"]'));

if($target === false){

    $target = current($xmldata->xpath('//AZIONE[@IDazione="'.$idazione.'"]/POST/QUANTUSATA[@IDingrediente="'.$idingrediente.'"]'));

    if($target === false){

        $target = current($xmldata->xpath('//AZIONE[@IDazione="'.$idazione.'"]/PRE/INGREDIENTE[@IDingrediente="'.$idingrediente.'"]'));
        
        if($target === false){

            $target = current($xmldata->xpath('//AZIONE[@IDazione="'.$idazione.'"]/POST/INGREDIENTE[@IDingrediente="'.$idingrediente.'"]'));

        }

        $insert = new SimpleXMLElement('<QUANTUSATA IDingrediente="'.$idingrediente.'">'.$quant_usata.'</QUANTUSATA>');

    }
}
// richiamo la funzione per l'inserimento
simplexml_insert_after($insert, $target);

// salvo tutto nel file
$xmldata->asXML("ricette/".$ricetta);

// questa serie di funzioni servono a sistemare la formattazione 
$dom = dom_import_simplexml($xmldata)->ownerDocument;
$dom->formatOutput = true;
$dom->preserveWhiteSpace = false;
$dom->loadXML( $dom->saveXML());
$dom->save("ricette/".$ricetta);

exit;
?>
