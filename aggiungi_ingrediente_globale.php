<?php
$nome = $_POST['nome'];
$immagine = $_POST['immagine'];

//con questo leggo dentro il json per controllare i valori, al massimo 4    
$myfile = fopen("ingredienti_global.json", "r") or die("Unable to open file!");
$txt = fread($myfile,filesize("ingredienti_global.json"));
fclose($myfile);

$ingredienti_array = json_decode($txt, true);

$nuovo['nome'] = $nome;

$nuovo['immagine'] = $immagine;

array_push($ingredienti_array, $nuovo);

$file = fopen("ingredienti_global.json","w");
fwrite($file, json_encode($ingredienti_array));
fclose($file);
exit;
?>