<?php 

require_once('lib/nusoap.php');

$posts_per_page = 10; 

header('Content-type: text/javascript;');
if (isset($_GET['s'])){
   $queryString = $_GET['s'];

 $params = array(
 'AppID' => '7962D27C3ED27AB2F3810F8D2B7BDA5F153A1061',
 'Query' => $queryString,
 'CultureInfo' => 'en-US',
 'SafeSearch' => 'Off',
 'Requests' => array (
 'SourceRequest' => array ( 
 'Source' => 'Web',
 'Offset' => 0,
 'Count' => 10,
 'ResultFields' => 'All' )));
 
 
 $soapclient = new soapclient("http://soap.search.msn.com/webservices.asmx");
 $searchresults = $soapclient->call("Search", array("Request"=>$params)); 
    if  (isset($searchresults['Responses'])) { 
      if ($searchresults['Responses']['SourceResponse']['Total'] > 0){
          echo $_REQUEST['callback'].'({"items":[';
          
          $results = $searchresults['Responses']['SourceResponse']['Results']['Result'];

          foreach ($results as $r){
                  if  (isset($r['Description'])){
                      echo '{"u":"'.$r['Url'].'","p":"'.str_replace('"','\"',$r['Title']).'","n":"'.str_replace('"','\"',$r['Description']).'"},';
                  }
          }
          echo ']})';
      } else {
      		echo $_REQUEST['callback'].'({"items":[]})';
      }
    }else{
        echo $_REQUEST['callback'].'({"items":[]})';
    }   
 }
 ?>


