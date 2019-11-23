<?php
$nome = $_POST['ing_da_eliminar'];
$imma = $_POST['imma_da_eliminar'];


//con questo leggo dentro il json per controllare i valori, al massimo 4    
$myfile = fopen("ingredienti_global.json", "r") or die("Unable to open file!");
$txt = fread($myfile, filesize("ingredienti_global.json"));
fclose($myfile);

$ingredienti_array = json_decode($txt, true);
echo var_dump($ingredienti_array);
$lung = count($ingredienti_array);

for ($i=0;$i<$lung;$i++){

        $uno = $ingredienti_array[$i]; 

        if ($uno['nome'] == $nome) {
                array_splice($ingredienti_array, $i, 1);
        }
}



$file = fopen("ingredienti_global.json", "w");
fwrite($file, json_encode($ingredienti_array));
fclose($file);
exit;
