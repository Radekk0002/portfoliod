<?php
error_reporting (0);

$mailToSend = "kontakt@dominikobloza.pl";

if ( $_SERVER["REQUEST_METHOD"] === "POST" ) {
    $email      = $_POST["email"];
    $subject    = $_POST["subject"];
    $message    = $_POST["message"];
    $antiSpam   = $_POST["fake"];
    $errors     = array();
    $return     = array();
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        array_push($errors, "email");
    }
    if (empty($subject)) {
        array_push($errors, "subject");
    }
    if (empty($message)) {
        array_push($errors, "message");
    }

    if (count($errors) > 0) {
        $return["errors"] = $errors;
    } 
    
    if(empty($antiSpam)){
    
        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type: text/plain; charset=UTF-8" . "\r\n";
        $headers .= "From: kontakt@dominikobloza.pl" ."\r\n";
        $headers .= "Reply-to: " . $email;
        $message = "Temat: " . $subject . "\r\n\r\n" . $message;
			

        if (mail($mailToSend, "Strona www - " . $subject . " - " . date("d-m-Y"), $message, $headers)) {
            $return["status"] = "ok";
        } else {
            $return["status"] = "error";
        }
    }else{
        $return["status"] = "Nie jesteś człowiekiem";
    }

    header("Content-Type: application/json");
    echo json_encode($return);
}