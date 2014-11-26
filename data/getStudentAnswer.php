<?php

//simple script to store and retrieve multiple student answers...
session_start();
$r='{"errMsg":"No Action Provided"}';
if(!isset($_SESSION['saa'])) $_SESSION['saa']=  array();
$saa=$_SESSION['saa'];
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
if(!isset($request->action)) {
    echo $r.  var_dump($request); 
    exit();
}
switch($request->action){
    case 'save':
        if(!isset($request->name)) $r='{"errMsg":"No name"}'.  var_dump($request); 
        else {
            $_SESSION['saa'][$request->name]=json_encode($request->value);
            $r='{"data":'.$_SESSION['saa'][$request->name].'}';
        }
        break;
    case 'fetch':
        if(isset($request->name)&&isset($saa[$request->name])) $r='{"data":'.$saa[$request->name].'}';
        else $r='{"errMsg":"No data for that name"}';
        break;
    case 'fetchAll':
        $sep="";$r="";
        foreach ($saa as $nm=>$data){
            $r.=$sep.$data;
            $sep=", ";
        }
        $r="[".$r."]";
        break;
    case 'clearAll':
        unset($_SESSION['saa']);
        $r='{"msg":"OK"}';
}
echo $r;


?>
