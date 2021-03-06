<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// questa invece è la variabile che mi servirà per individuare l'ingrediente da cancellare
$id = $_POST['id2'];

// creo l'oggetto che mi permette di manipolare l'XML più facilmente
$doc = new DOMDocument;
$doc->load('ricette/'.$ricetta);
$bah = $doc->documentElement; 

// prendo tutti gli elementi che hanno come tag INGREDIENTE
$featuredde1 = $bah->getElementsByTagName('INGREDIENTE');

$length = $featuredde1->length;

// ricerco l'elemento che voglio cancellare
for ($i=$length-1;$i>=0;$i--)
{
    $p = $featuredde1->item($i);    
    $pid = $p->getAttribute("IDingrediente");
    
    if ($pid == $id)
    {
        $parent = $p->parentNode;
        $parent->removeChild($p);  
    }
} 

// formatto l'output per avere una buona indentazione
$doc->formatOutput = true;

// salvo tutto nel file
$doc->save("ricette/".$ricetta);

// questa serie di funzioni servono a sistemare la formattazione MEGLIO
$xmldata = simplexml_load_file("ricette/".$ricetta) or die("Failed to load");
$dom = dom_import_simplexml($xmldata)->ownerDocument;
$dom->formatOutput = true;
$dom->preserveWhiteSpace = false;
$dom->loadXML( $dom->saveXML());
$dom->save("ricette/".$ricetta);

exit;
?>

