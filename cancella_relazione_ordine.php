<?php
$ricetta = $_POST['ricetta'];
// questo è il nome in input dall'utente
$idsource = $_POST['source'];
// questo è il nome in input dall'utente
$idtarget = $_POST['target'];
// creo l'oggetto che mi permette di manipolare l'XML più facilmente
$doc = new DOMDocument;
$doc->load('ricette/'.$ricetta);
$bah = $doc->documentElement;

$featuredde1 = $bah->getElementsByTagName('RELAZIONEdORDINE');

$length = $featuredde1->length;

// Iterate backwards by decrementing the loop counter 
for ($i=$length-1;$i>=0;$i--)
{
    $p = $featuredde1->item($i);    
    $azsource = $p->getAttribute("IDazionePrec");
    $aztarget = $p->getAttribute("IDazioneSucc");
    
    if ($azsource == $idsource && $aztarget == $idtarget)
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

