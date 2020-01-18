<?php
// queste varibili mi permettono di identificare l'elemento giusto
$nome = $_POST['ing_da_eliminar'];
$imma = $_POST['imma_da_eliminar'];

//con questo apro il JSON delle azioni e leggo tutti i valori inserendoli dentro una variabile     
$myfile = fopen("ingredienti_global.json", "r") or die("Unable to open file!");
$txt = fread($myfile, filesize("ingredienti_global.json"));
fclose($myfile);

// decodifico la variabile dove ho inserito tutti i valori per farla diventare un'array
$ingredienti_array = json_decode($txt, true);

$lung = count($ingredienti_array);

// cerco dentro l'array appena creato
for ($i = 0; $i < $lung; $i++) {

        $uno = $ingredienti_array[$i];

        if ($uno['nome'] == $nome) {

                array_splice($ingredienti_array, $i, 1);
        }
}

// infine apro ancora il file ma stavolta in scrittura e salvo l'array modificato
$file = fopen("ingredienti_global.json", "w");
fwrite($file, json_encode($ingredienti_array));
fclose($file);
exit;
