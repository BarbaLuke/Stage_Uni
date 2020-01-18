<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// queste due varibili mi permettono di trovare la relazione giusta
$idsource = $_POST['source'];
$idtarget = $_POST['target'];

// creo l'oggetto che mi permette di manipolare l'XML più facilmente
$doc = new DOMDocument;
$doc->load('ricette/'.$ricetta);
$bah = $doc->documentElement;

// prendo tutti gli elementi che hanno come tag RELAZIONEdORDINE
$featuredde1 = $bah->getElementsByTagName('RELAZIONEdORDINE');

$length = $featuredde1->length;

// cerco tra tutte le relazioni d'ordine
for ($i=$length-1;$i>=0;$i--){

    $p = $featuredde1->item($i);   

    $azsource = $p->getAttribute("IDazionePrec");

    $aztarget = $p->getAttribute("IDazioneSucc");
    
    if ($azsource == $idsource && $aztarget == $idtarget){

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

