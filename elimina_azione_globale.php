<?php
$nome = $_POST['act_da_eliminar'];

//con questo leggo dentro il json per controllare i valori, al massimo 4    
$myfile = fopen("azioni_global.json", "r") or die("Unable to open file!");
$txt = fread($myfile, filesize("azioni_global.json"));
fclose($myfile);

$azioni_array = json_decode($txt, true);

$lung = count($azioni_array);

for ($i=0;$i<$lung;$i++){

        $uno = $azioni_array[$i]; 

        if ($uno['nome'] == $nome) {
                array_splice($azioni_array, $i, 1);
        }
}



$file = fopen("azioni_global.json", "w");
fwrite($file, json_encode($azioni_array));
fclose($file);
exit;
