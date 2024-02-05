<?php

namespace App\Http;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require __DIR__ . "/../../vendor/autoload.php";
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__ . "/../../");
$dotenv->load();
class Auth
{

    public function createToken(array $data, string $scope = 'user') : string
    {
        $payload = [
            'iss' => $_SERVER['REMOTE_ADDR'],
            'iat' => time(),
            'exp' => time() + (3600 * 12),
            'data' => $data,
            'scope' => $scope
        ];

        $jwt = JWT::encode($payload, $_ENV["JWT_KEY"], 'HS256');

        return $jwt;
    }

    public function verify()
    {
        $token = Request::getAuthToken();

        $decoded = JWT::decode($token, new Key($_ENV["JWT_KEY"], 'HS256'));

        return $decoded;
    }
}