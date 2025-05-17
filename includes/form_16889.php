<?php
	if (empty($_POST['name_24998_16889']) && strlen($_POST['name_24998_16889']) == 0 || empty($_POST['email_24998_16889']) && strlen($_POST['email_24998_16889']) == 0 || empty($_POST['message_24998_16889']) && strlen($_POST['message_24998_16889']) == 0)
	{
		return false;
	}
	
	$name_24998_16889 = $_POST['name_24998_16889'];
	$email_24998_16889 = $_POST['email_24998_16889'];
	$message_24998_16889 = $_POST['message_24998_16889'];
	$optin_24998_16889 = $_POST['optin_24998_16889'];
	
	// Create Message	
	$to = 'receiver@yoursite.com';
	$email_subject = "Message from a Blocs website.";
	$email_body = "You have received a new message. \n\nName_24998_16889: $name_24998_16889 \nEmail_24998_16889: $email_24998_16889 \nMessage_24998_16889: $message_24998_16889 \nOptin_24998_16889: $optin_24998_16889 \n";
	$headers = "MIME-Version: 1.0\r\nContent-type: text/plain; charset=UTF-8\r\n";	
	$headers .= "From: contact@yoursite.com\r\n";
	$headers .= "Reply-To: $email_24998_16889";

	// Post Message
	if (function_exists('mail'))
	{
		$result = mail($to,$email_subject,$email_body,$headers);
	}
	else // Mail() Disabled
	{
		$error = array("message" => "The php mail() function is not available on this server.");
	    header('Content-Type: application/json');
	    http_response_code(500);
	    echo json_encode($error);
	}	
?>