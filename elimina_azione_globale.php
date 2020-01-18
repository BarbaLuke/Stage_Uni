<?php
// questa varibile mi permette di identificare l'elemento giusto
$nome = $_POST['act_da_eliminar'];

//con questo apro il JSON delle azioni e leggo tutti i valori inserendoli dentro una variabile  
$myfile = fopen("azioni_global.json", "r") or die("Unable to open file!");
$txt = fread($myfile, filesize("azioni_global.json"));
fclose($myfile);

// decodifico la variabile dove ho inserito tutti i valori per farla diventare un'array
$azioni_array = json_decode($txt, true);

$lung = count($azioni_array);

// cerco dentro l'array appena creato
for ($i = 0; $i < $lung; $i++) {

        $uno = $azioni_array[$i];

        if ($uno['nome'] == $nome) {

                array_splice($azioni_array, $i, 1);
        }
}

// infine apro ancora il file ma stavolta in scrittura e salvo l'array modificato
$file = fopen("azioni_global.json", "w");
fwrite($file, json_encode($azioni_array));
fclose($file);
exit;
