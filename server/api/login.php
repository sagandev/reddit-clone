<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require __DIR__ . '/../../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
$dotenv->load();

use App\libs\UserAuth;
use App\Model\Session;
use App\Model\Response;
$user = new UserAuth();
Session::init();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (empty($_POST['email']) || empty($_POST['password'])) {
        $response = new Response(400, 'Not all data provided');
        $response->send();
        exit;
    }

    $email = htmlspecialchars($_POST['email']);
    $password = htmlspecialchars($_POST['password']);

    try {
        $user = $user->login($email, $password);
    } catch (Exception $e) {
        http_response_code(500);
        throw new Exception("Error while executing query; MESSAGE: " . $e->getMessage());
        exit;
    }

    if (!$user) {
        $response = new Response(401, 'Incorrect email or password');
        $response->send();
        exit;
    }

    $payload = [
        'iss' => $_SERVER['REMOTE_ADDR'],
        'iat' => time(),
        'exp' => time() + (3600 * 12),
        'data' => [
            'username' => $user['username'],
            'email' => $user['email']
        ],
        'scope' => 'user'
    ];

    $jwt = JWT::encode($payload, $_ENV["JWT_KEY"], 'HS256');
    Session::set('user', $user);
    $response = new Response(200, 'Signed in successfully', ['user' => $user, 'auth_token' => $jwt]);
    $response->send();
}
