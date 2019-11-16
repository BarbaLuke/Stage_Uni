<?php
$nome_nuovo = $_POST['nome_nuovo'];
$nome_vecchio = $_POST['nome_vecchio'];

//con questo leggo dentro il json per controllare i valori, al massimo 4    
$myfile = fopen("ingredienti_global.json", "r") or die("Unable to open file!");
$txt = fread($myfile,filesize("ingredienti_global.json"));
fclose($myfile);

$ingredienti_array = json_decode($txt, true);

foreach($ingredienti_array as $ingred => $entry){
    if($entry['nome'] == $nome_vecchio){

            $ingredienti_array[$ingred]['nome'] = $nome_nuovo;

    }
}

$file = fopen("ingredienti_global.json","w");
fwrite($file, json_encode($ingredienti_array));
fclose($file);
exit;
?>