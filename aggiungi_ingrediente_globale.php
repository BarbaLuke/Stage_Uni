<?php
// variabili che mi servono per aggiungere l'ingrediente
$nome = $_POST['nome'];
$immagine = $_POST['immagine'];

//con questo apro il JSON delle azioni e leggo tutti i valori inserendoli dentro una variabile  
$myfile = fopen("ingredienti_global.json", "r") or die("Unable to open file!");
$txt = fread($myfile,filesize("ingredienti_global.json"));
fclose($myfile);

// decodifico la variabile dove ho inserito tutti i valori per farla diventare un'array
$ingredienti_array = json_decode($txt, true);

//creo un elemento nuovo da inserire nell'array
$nuovo['nome'] = $nome;
$nuovo['immagine'] = $immagine;

// faccio una push dentro l'array con tutti i valori del file
array_push($ingredienti_array, $nuovo);

// infine apro ancora il file ma stavolta in scrittura e salvo l'array con il nuovo elemento pushato
$file = fopen("ingredienti_global.json","w");
fwrite($file, json_encode($ingredienti_array));
fclose($file);
exit;
?>