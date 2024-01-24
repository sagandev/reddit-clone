<?php
require_once dirname(realpath(__FILE__)) . "/../libs/Session.php";
require_once dirname(realpath(__FILE__)) . "/../classes/UserAuth.php";
require_once dirname(realpath(__FILE__)) . "/../helpers/DataFormatter.php";
$user = new UserAuth();

if($_SERVER["REQUEST_METHOD"] == "POST") {
    if(empty($_POST["email"]) || empty($_POST["password"])) {
        http_response_code(400);
        die(json_encode(array("status" => "Error", "message" => "Not all data provided")));
    }

    $email = htmlspecialchars($_POST["email"]);
    $password = htmlspecialchars($_POST["password"]);

    $email = DataFormatter::email($email);

    if(!$email) {
        http_response_code(400);
        echo json_encode(array("status" => "Error", "message" => "Wrong email syntax"));
    }

    try {
        $register = $user->register($email, $password);
    } catch(Exception $e) {
        http_response_code(500);
        die (json_encode(array("status" => "Error", "message" => $e->getMessage())));
    }

    if(!$register) {
        http_response_code(400);
        die(json_encode(array("status" => "Error", "message" => "User already exists")));
    }
    http_response_code(200);
    echo json_encode(array("status" => "Success", "message" => "Signed up successfully"));
}