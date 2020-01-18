<?php
// variabili che mi servono per aggiungere l'azione
$nome = $_POST['nome'];
$immagine = $_POST['immagine'];

//con questo apro il JSON delle azioni e leggo tutti i valori inserendoli dentro una variabile
$myfile = fopen("azioni_global.json", "r") or die("Unable to open file!");
$txt = fread($myfile,filesize("azioni_global.json"));
fclose($myfile);

// decodifico la variabile dove ho inserito tutti i valori per farla diventare un'array
$azioni_array = json_decode($txt, true);

//creo un elemento nuovo da inserire nell'array
$nuovo['nome'] = $nome;
$nuovo['immagine'] = $immagine;

// faccio una push dentro l'array con tutti i valori del file
array_push($azioni_array, $nuovo);

// infine apro ancora il file ma stavolta in scrittura e salvo l'array con il nuovo elemento pushato
$file = fopen("azioni_global.json","w");
fwrite($file, json_encode($azioni_array));
fclose($file);
exit;
?>