<?php
include 'settings.php';

// Create connection
$sql = new mysqli($servername, $username, $password, $db);


//simple script to store and retrieve multiple student answers...
$r='{"errMsg":"No Action Provided"}';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
if(!isset($_REQUEST['action'])) {
    echo $r.  var_dump($_REQUEST); 
    exit();
}
switch($_REQUEST['action']){
    case 'save':
        if(!isset($request->name)) $r='{"errMsg":"No name"}'; 
        else {
            if(isset($request->id)){
            /* prepared statements didnt work on production server??
                $q="update  bp_answers set name=?, value=? where id=?";
                $stmt=$sql->prepare($q);
                $stmt->bind_param("ssi", $request->name, json_encode($request->value), $request->id);
                $stmt->execute();
             */
                $sql->query("update  bp_answers set name='".$sql->real_escape_string($request->name)."', value='".$sql->real_escape_string(json_encode($request->value))."' where id=".$sql->real_escape_string($request->id)."");
            }
            else{
            /* prepared statements didnt work on production server??
                $q="insert into bp_answers (name,value) values (?,?)";
                $stmt=$sql->prepare($q);
                $stmt->bind_param("ss", $request->name, json_encode($request->value));
                $stmt->execute();
             */
                $sql->query("insert into  bp_answers (name, value) values ('".$sql->real_escape_string($request->name)."', '".$sql->real_escape_string(json_encode($request->value))."')");
                $request->id=$sql->insert_id;
            }
            $r=  json_encode($request);
        }
        break;
    case 'fetch':
        if(isset($request->name)){
            /* prepared statements didnt work on production server??
            $stmt=$sql->prepare("select * from bp_answers where name=?");
            $stmt->bind_param("s",$request->name);
            $stmt->execute();
            $stmt->bind_result($request->id, $request->name, $request->value);
            if($stmt->fetch()){
                $request->value=  json_decode($request->value);
                $r= json_encode($request);
            }
             * 
             */
            $res=$sql->query("select * from bp_answers where name ='".$sql->real_escape_string($request->name)."'");
            if($row=$res->fetch_assoc()){
                $row['value']=  json_decode($row['value']);
                $r=  json_encode ($row);
            }
            else $r='{"errMsg":"No data for that name"}';
        }
        else $r='{"errMsg":"No data for that name"}';
        break;
    case 'fetchAll':
        $r="";
        /* prepared statements didnt work on production server??
        $stmt=$sql->prepare("select value from bp_answers");
        $stmt->execute();
        $stmt->bind_result($value);
        $sep="";
        while($stmt->fetch()){
            $r.=$sep.$value;
            $sep=",";
        }
         * 
         */
        $sep="";
        $res=$sql->query("select value from bp_answers where value is not null and value !='' ");
        while($row=$res->fetch_assoc()){
            $r.=$sep.$row['value'];
            $sep=",";
        }
        $r= "[".$r."]";
        break;
    case 'clearAll':
        $stmt=$sql->query("delete from bp_answers");
        $r='{"msg":"OK"}';
}
echo $r;
$sql->close();
?>
