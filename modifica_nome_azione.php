<?php
$nome_nuovo = $_POST['nome_nuovo'];
$nome_vecchio = $_POST['nome_vecchio'];


//con questo leggo dentro il json per controllare i valori, al massimo 4    
$myfile = fopen("azioni_globali.json", "r") or die("Unable to open file!");
$txt = fread($myfile,filesize("azioni_globali.json"));
fclose($myfile);

$azioni_array = json_decode($txt, true);

foreach($azioni_array as $azion => $entry){
    if($entry['nome'] == $nome_vecchio){

            $azioni_array[$azion]['nome'] = $nome_nuovo;

    }
}

$file = fopen("azioni_globali.json","w");
fwrite($file, json_encode($azioni_array));
fclose($file);
exit;
?>