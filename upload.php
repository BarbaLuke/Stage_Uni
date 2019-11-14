<?php
if(isset($_FILES['xml'])){
   $errors= array();
   $file_name = $_FILES['xml']['name'];
   $file_size =$_FILES['xml']['size'];
   $file_tmp =$_FILES['xml']['tmp_name'];
   $file_type=$_FILES['xml']['type'];
   $file_ext=strtolower(end(explode('.',$_FILES['xml']['name'])));

   $extensions= array("xml");

   if(in_array($file_ext,$extensions)=== false){
      $errors[]="extension not allowed, please choose a JPEG or PNG file.";
   }

   if(empty($errors)==true){
      move_uploaded_file($file_tmp,"ricette/".$file_name);
      header('Location: grafico.html');
      exit;
   }else{
   print_r($errors);
   }
}
?>