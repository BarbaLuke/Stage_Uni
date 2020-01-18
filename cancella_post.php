<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// queste due varibili come dal nome mi permettono di trovare l'ingrediente in POST
$id_ingre = $_POST['source'];
$id_azione = $_POST['target'];

// creo l'oggetto che mi permette di manipolare l'XML più facilmente
$doc = new DOMDocument;
$doc->load('ricette/'.$ricetta);
$bah = $doc->documentElement; 

// prendo tutti gli elementi che hanno come tag AZIONE
$featuredde1 = $bah->getElementsByTagName('AZIONE');

$length = $featuredde1->length;

// cerco tra tutti gli ingredienti in POST dell'azione giusta
for ($i = $length - 1; $i >= 0; $i--) {

    $p = $featuredde1->item($i);

    $pid = $p->getAttribute("IDazione");

    if ($pid == $id_azione) {

        $pre = $p->getElementsByTagName('POST');

        if (isset($pre)) {

            $ingredienti = $pre->item(0)->getElementsByTagName('INGREDIENTE');

            $length2 = $ingredienti->length;

            for ($a = $length2 - 1; $a >= 0; $a--) {

                $p2 = $ingredienti->item($a);
                
                $pid2 = $p2->getAttribute("IDingrediente");

                if ($pid2 == $id_ingre) {

                    $parent2 = $p2->parentNode;
                    $parent2->removeChild($p2);
                }
            }
        }
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

