<?php
$ricetta = $_POST['ricetta'];
// questo è l'id che ho nascosto all'utente che servirà per trovare 
$id = $_POST['id2'];
// creo l'oggetto che mi permette di manipolare l'XML più facilmente
$doc = new DOMDocument;
$doc->load('ricette/'.$ricetta);
$bah = $doc->documentElement; 

$featuredde1 = $bah->getElementsByTagName('INGREDIENTE');

$length = $featuredde1->length;

// Iterate backwards by decrementing the loop counter 
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

$doc->formatOutput = true;
// salvo tutto nel file
$doc->save("ricette/".$ricetta);

$xmldata = simplexml_load_file("ricette/".$ricetta) or die("Failed to load");
// questa serie di funzioni servono a sistemare la formattazione 
$dom = dom_import_simplexml($xmldata)->ownerDocument;
$dom->formatOutput = true;
$dom->preserveWhiteSpace = false;
$dom->loadXML( $dom->saveXML());
$dom->save("ricette/".$ricetta);

exit;
?>

