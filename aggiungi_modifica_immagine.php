<?php
$nome = $_POST['nome'];
$immagine = $_POST['immagine'];
$cosa = $_POST['cosa'];

if($cosa === "ingrediente"){

    $myfile = fopen("ingredienti_global.json", "r") or die("Unable to open file!");
$txt = fread($myfile,filesize("ingredienti_global.json"));
fclose($myfile);

$ingredienti_array = json_decode($txt, true);

foreach($ingredienti_array as $ingred => $entry){
    if($entry['nome'] == $nome){

        if($entry['immagine'] !== $immagine){

            $ingredienti_array[$ingred]['immagine'] = $immagine;

        }
    }
}

$file = fopen("ingredienti_global.json","w");
fwrite($file, json_encode($ingredienti_array));
fclose($file);

}else{

    $myfile = fopen("azioni_global.json", "r") or die("Unable to open file!");
    $txt = fread($myfile,filesize("azioni_global.json"));
    fclose($myfile);
    
    $azioni_array = json_decode($txt, true);
    
    foreach($azioni_array as $azio => $entry){
        if($entry['nome'] == $nome){
    
            if($entry['immagine'] !== $immagine){
    
                $azioni_array[$azio]['immagine'] = $immagine;
    
            }
        }
    }
    
    $file = fopen("azioni_global.json","w");
    fwrite($file, json_encode($azioni_array));
    fclose($file);

}
   
exit;
?>