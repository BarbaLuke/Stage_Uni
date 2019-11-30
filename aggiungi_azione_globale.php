<?php
$nome = $_POST['nome'];

//con questo leggo dentro il json per controllare i valori, al massimo 4    
$myfile = fopen("azioni_global.json", "r") or die("Unable to open file!");
$txt = fread($myfile,filesize("azioni_global.json"));
fclose($myfile);

$azioni_array = json_decode($txt, true);

$nuovo['nome'] = $nome;

array_push($azioni_array, $nuovo);

$file = fopen("azioni_global.json","w");
fwrite($file, json_encode($azioni_array));
fclose($file);
exit;
?>