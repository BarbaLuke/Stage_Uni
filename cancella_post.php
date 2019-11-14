<?php
$ricetta = $_POST['ricetta'];
// questo è l'id che ho nascosto all'utente che servirà per trovare 
$id_ingre = $_POST['source'];
$id_azione = $_POST['target'];
// creo l'oggetto che mi permette di manipolare l'XML più facilmente
$doc = new DOMDocument;
$doc->load('ricette/'.$ricetta);
$bah = $doc->documentElement; 

$featuredde1 = $bah->getElementsByTagName('AZIONE');

$length = $featuredde1->length;

// Iterate backwards by decrementing the loop counter 
for ($i=$length-1;$i>=0;$i--){
    
    $p = $featuredde1->item($i); 
    
    $pid = $p->getAttribute("IDazione");
    
    if ($pid == $id_azione){
        
        $pre = $p->getElementsByTagName('POST');
        
        if(isset($pre)){
            
            $ingredienti = $pre->item(0)->getElementsByTagName('INGREDIENTE');
            echo $ingredienti->item(0)->nodeValue;
            $length2 = $ingredienti->length;
            for ($a = $length2 - 1 ; $a >= 0 ; $a--){
                $p2 = $ingredienti->item($a);    
            $pid2 = $p2->getAttribute("IDingrediente");
    
            if ($pid2 == $id_ingre){
                $parent2 = $p2->parentNode;
                $parent2->removeChild($p2);
            }   
        }
    }
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

