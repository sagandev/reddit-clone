<?php

require_once dirname(realpath(__FILE__)) . '/../libs/Session.php';
require_once dirname(realpath(__FILE__)) . '/../classes/UserAuth.php';
require_once dirname(realpath(__FILE__)) . '/../helpers/DataFormatter.php';
require_once dirname(realpath(__FILE__)) . '/../libs/Response.php';
$user = new UserAuth();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (empty($_POST['email']) || empty($_POST['password'])) {
        $response = new Response(400, 'Not all data provided');
        $response->send();
        exit;
    }

    $email = htmlspecialchars($_POST['email']);
    $password = htmlspecialchars($_POST['password']);

    $email = DataFormatter::email($email);

    if (!$email) {
        $response = new Response(400, 'Wrong email syntax');
        $response->send();
        exit;
    }

    try {
        $register = $user->register($email, $password);
    } catch (Exception $e) {
        http_response_code(500);
        exit;
    }

    if (!$register) {
        $response = new Response(400, 'User already exists');
        $response->send();
        exit;
    }
    $response = new Response(200, 'Signed up successfully');
    $response->send();
}
