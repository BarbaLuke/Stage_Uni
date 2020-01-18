<?php
// varibili che mi servono per identificare l'elemento dove inserire o modificare l'immagine
$nome = $_POST['nome'];
$immagine = $_POST['immagine'];
$cosa = $_POST['cosa'];

// se devo modificare un ingrediente
if($cosa === "ingrediente"){

// apro il file JSON in lettura per salvare tutti i valori in una variabile    
    $myfile = fopen("ingredienti_global.json", "r") or die("Unable to open file!");
    $txt = fread($myfile,filesize("ingredienti_global.json"));
    fclose($myfile);

// decodifico la variabile dove ho inserito tutti i valori per farla diventare un'array    
    $ingredienti_array = json_decode($txt, true);

// ricerco quindi il nome dell'ingrediente nell'array
    foreach($ingredienti_array as $ingred => $entry){
        if($entry['nome'] == $nome){
            if($entry['immagine'] !== $immagine){

// cambio infine il campo immagine dell'elemento cercato
                $ingredienti_array[$ingred]['immagine'] = $immagine;
        }
    }
}

// infine apro ancora il file ma stavolta in scrittura e salvo l'array con la modifica appena fatta
$file = fopen("ingredienti_global.json","w");
fwrite($file, json_encode($ingredienti_array));
fclose($file);

// se invece la modifica deve essere effettuata nella lista delle azioni
}else{

// apro il file JSON in lettura per salvare tutti i valori in una variabile   
    $myfile = fopen("azioni_global.json", "r") or die("Unable to open file!");
    $txt = fread($myfile,filesize("azioni_global.json"));
    fclose($myfile);

// decodifico la variabile dove ho inserito tutti i valori per farla diventare un'array   
    $azioni_array = json_decode($txt, true);

// ricerco quindi il nome dell'ingrediente nell'array
    foreach($azioni_array as $azio => $entry){
        if($entry['nome'] == $nome){
            if($entry['immagine'] !== $immagine){

// cambio infine il campo immagine dell'elemento cercato
                $azioni_array[$azio]['immagine'] = $immagine;
            }
        }
    }
    
// infine apro ancora il file ma stavolta in scrittura e salvo l'array con la modifica appena fatta
    $file = fopen("azioni_global.json","w");
    fwrite($file, json_encode($azioni_array));
    fclose($file);
}
exit;
?>