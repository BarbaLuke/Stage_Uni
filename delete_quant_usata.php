<?php
// variabile che mi serve per individuare la ricetta da modificare
$ricetta = $_POST['ricetta'];

// queste varibili servono per identificare l'elemento giusto
$id_ingre = $_POST['id_in'];
$id_azione = $_POST['id_az'];

// creo l'oggetto che mi permette di manipolare l'XML più facilmente
$doc = new DOMDocument;
$doc->load('ricette/'.$ricetta);
$bah = $doc->documentElement;

// prendo tutti gli elementi che hanno come tag AZIONE
$featuredde1 = $bah->getElementsByTagName('AZIONE');

$length = $featuredde1->length;

// cerco tra tutte le azioni
for ($i = $length - 1; $i >= 0; $i--){

    $p = $featuredde1->item($i);

    $pid = $p->getAttribute("IDazione");

    if ($pid == $id_azione) {

        $pre = $p->getElementsByTagName('PRE');

        if (isset($pre)) {

            $quantit_us = $pre->item(0)->getElementsByTagName('QUANTUSATA');

            $length2 = $quantit_us->length;

            for ($a = $length2 - 1; $a >= 0; $a--) {

                $p2 = $quantit_us->item($a);

                $pid2 = $p2->getAttribute("IDingrediente");

                if ($pid2 == $id_ingre) {

                    $parent2 = $p2->parentNode;

                    $parent2->removeChild($p2);
                }
            }
        }

        $post = $p->getElementsByTagName('POST');

        if (isset($post)){

            $quantit_us2 = $post->item(0)->getElementsByTagName('QUANTUSATA');

            $length3 = $quantit_us2->length;

            for ($a2 = $length3 - 1; $a2 >= 0; $a2--){

                $p3 = $quantit_us2->item($a2);

                $pid3 = $p3->getAttribute("IDingrediente");

                if ($pid3 == $id_ingre) {

                    $parent3 = $p3->parentNode;

                    $parent3->removeChild($p3);
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
