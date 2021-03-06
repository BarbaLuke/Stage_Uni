<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// creo l'oggetto che mi permette di manipolare l'XML più facilmente
$doc = new DOMDocument;
$doc->load('ricette/'.$ricetta);
$bah = $doc->documentElement; 

// prendo tutti gli elementi che hanno come tag TESTO
$featuredde1 = $bah->getElementsByTagName('TESTO');

$length = $featuredde1->length;

// ricerco l'elemento che voglio cancellare
for ($i=$length-1;$i>=0;$i--){

    $p = $featuredde1->item($i); 

    $parent = $p->parentNode;

    $parent->removeChild($p);  
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