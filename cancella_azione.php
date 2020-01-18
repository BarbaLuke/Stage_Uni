<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// questa invece è la variabile che mi servirà per individuare l'azione da cancellare
$id = $_POST['id2'];

// creo l'oggetto che mi permette di manipolare l'XML più facilmente
$doc = new DOMDocument;
$doc->load('ricette/'.$ricetta);
$bah = $doc->documentElement; 

// prendo tutti gli elementi che hanno come tag AZIONE
$featuredde1 = $bah->getElementsByTagName('AZIONE');

$length = $featuredde1->length;

// ricerco l'elemento che voglio cancellare
for ($i=$length-1;$i>=0;$i--){

    $p = $featuredde1->item($i);    

    $pid = $p->getAttribute("IDazione");
    
    if ($pid == $id){
        $parent = $p->parentNode;
        $parent->removeChild($p);  
    }
}

// una volta cancellata l'azione (e tutto quello che stava dentro)
// devo avere cura di non lasciare alcun collegamento con quell'azione appena cancellata
// per questo è bene cancellare anche le relazioni d'ordine che contengono quell'azione
// prendo tutti gli elementi che hanno come tag RELAZIONEdORDINE
$featuredde1 = $bah->getElementsByTagName('RELAZIONEdORDINE');

$length = $featuredde1->length;

// ricerco l'elemento che voglio cancellare
for ($i=$length-1;$i>=0;$i--){

    $p = $featuredde1->item($i);  

    $pid = $p->getAttribute("IDazionePrec");

    if ($pid == $id){

        $parent = $p->parentNode;
        $parent->removeChild($p);  
    }

    $pid2 = $p->getAttribute("IDazioneSucc");

    if ($pid2 == $id){

        $parent = $p->parentNode;
        $parent->removeChild($p);  
    }
}

// è bene cancellare pure le relazioni di simultaneità che contengono quell'azione
// prendo tutti gli elementi che hanno come tag RELAZIONEdiSIMULT
$featuredde1 = $bah->getElementsByTagName('RELAZIONEdiSIMULT');

$length = $featuredde1->length;

// ricerco l'elemento che voglio cancellare
for ($i=$length-1;$i>=0;$i--){

    $p = $featuredde1->item($i);    

    $pid = $p->getAttribute("IDazioneDurevole");

    if ($pid == $id){

        
        $parent = $p->parentNode;

        $parent->removeChild($p);  
    }

    $pid2 = $p->getAttribute("IDazioneCondizione");

    if ($pid2 == $id){

        $parent = $p->parentNode;

        $parent->removeChild($p);  
    }
}

// formatto l'output per avere una buona indentazione
$doc->formatOutput = true;

// salvo tutto nel file
$doc->save("ricette/".$ricetta);

// questa serie di funzioni servono a sistemare la formattazione meglio
$xmldata = simplexml_load_file("ricette/".$ricetta) or die("Failed to load");
$dom = dom_import_simplexml($xmldata)->ownerDocument;
$dom->formatOutput = true;
$dom->preserveWhiteSpace = false;
$dom->loadXML( $dom->saveXML());
$dom->save("ricette/".$ricetta);

exit;
?>