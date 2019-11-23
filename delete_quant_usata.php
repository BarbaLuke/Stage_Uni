<?php
$ricetta = $_POST['ricetta'];
// questo è l'id che ho nascosto all'utente che servirà per trovare 
$id_ingre = $_POST['id_in'];
$id_azione = $_POST['id_az'];
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
        
        $pre = $p->getElementsByTagName('PRE');
        
        if(isset($pre)){
            
            $quantit_us = $pre->item(0)->getElementsByTagName('QUANTUSATA');
            $length2 = $quantit_us->length;
            for ($a = $length2 - 1 ; $a >= 0 ; $a--){

                $p2 = $quantit_us->item($a);
                $pid2 = $p2->getAttribute("IDingrediente");
                if ($pid2 == $id_ingre){
                    $parent2 = $p2->parentNode;
                    $parent2->removeChild($p2);
                }   
            }
        }

        $post = $p->getElementsByTagName('POST');
        
        if(isset($post)){
            
            $quantit_us2 = $post->item(0)->getElementsByTagName('QUANTUSATA');
            $length3 = $quantit_us2->length;
            for ($a2 = $length3 - 1 ; $a2 >= 0 ; $a2--){

                $p3 = $quantit_us2->item($a2);
                $pid3 = $p3->getAttribute("IDingrediente");
                if ($pid3 == $id_ingre){
                    $parent3 = $p3->parentNode;
                    $parent3->removeChild($p3);
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
