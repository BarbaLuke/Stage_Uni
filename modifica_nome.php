<?php
// variabili che servono per cercare e modificare il nome dell'ingrediente
$nome_nuovo = $_POST['nome_nuovo'];
$nome_vecchio = $_POST['nome_vecchio'];

//con questo apro il JSON delle azioni e leggo tutti i valori inserendoli dentro una variabile 
$myfile = fopen("ingredienti_global.json", "r") or die("Unable to open file!");
$txt = fread($myfile,filesize("ingredienti_global.json"));
fclose($myfile);

// decodifico la variabile dove ho inserito tutti i valori per farla diventare un'array
$ingredienti_array = json_decode($txt, true);

// ricerco l'elemento che voglio modificare
foreach($ingredienti_array as $ingred => $entry){

    if($entry['nome'] == $nome_vecchio){

            $ingredienti_array[$ingred]['nome'] = $nome_nuovo;
    }
}

// infine apro ancora il file ma stavolta in scrittura e salvo l'array con il nuovo elemento modificato
$file = fopen("ingredienti_global.json","w");
fwrite($file, json_encode($ingredienti_array));
fclose($file);
exit;
?>