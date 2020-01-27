<?php
// variabili che servono per cercare e modificare il nome dell'azione
$nome_nuovo = $_POST['nome_nuovo'];
$nome_vecchio = $_POST['nome_vecchio'];

//con questo apro il JSON delle azioni e leggo tutti i valori inserendoli dentro una variabile   
$myfile = fopen("azioni_global.json", "r") or die("Unable to open file!");
$txt = fread($myfile,filesize("azioni_global.json"));
fclose($myfile);

// decodifico la variabile dove ho inserito tutti i valori per farla diventare un'array
$azioni_array = json_decode($txt, true);

// ricerco l'elemento che voglio modificare
foreach($azioni_array as $azion => $entry){

    if($entry['nome'] == $nome_vecchio){

            $azioni_array[$azion]['nome'] = $nome_nuovo;
    }
}

// infine apro ancora il file ma stavolta in scrittura e salvo l'array con il nuovo elemento modificato
$file = fopen("azioni_global.json","w");
fwrite($file, json_encode($azioni_array));
fclose($file);
exit;
?>