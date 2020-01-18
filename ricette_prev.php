<?php
// questo mi permette di avere la lista dei file nella directory ricette
$dir = 'ricette';
$files = scandir($dir);
echo json_encode($files);
return json_encode($files);
?>

