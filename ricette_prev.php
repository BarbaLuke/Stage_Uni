<?php
$dir = 'ricette';
$files = scandir($dir);
echo json_encode($files);
return json_encode($files);

?>

