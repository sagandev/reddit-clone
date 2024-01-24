<?php
require_once dirname(realpath(__FILE__)) . "/../libs/Session.php";
require_once dirname(realpath(__FILE__)) . "/../classes/UserAuth.php";

$user = new UserAuth();
Session::init();
if($_SERVER["REQUEST_METHOD"] == "POST") {
    if(empty($_POST["email"]) || empty($_POST["password"])) {
        http_response_code(400);
        die(json_encode(array("status" => "Error", "message" => "Not all data provided")));
    }

    $email = htmlspecialchars($_POST["email"]);
    $password = htmlspecialchars($_POST["password"]);

    try {
        $login = $user->login($email, $password);
    } catch(Exception $e) {
        http_response_code(500);
        die (json_encode(array("status" => "Error", "message" => $e->getMessage())));
    }

    if(!$login) {
        http_response_code(401);
        die(json_encode(array("status" => "Error", "message" => "Incorrect email or password")));
    }

    Session::set("user", $login);
    http_response_code(200);
    echo json_encode(array("status" => "Success", "message" => "Signed in successfully"));
}