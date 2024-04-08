<?php

namespace App\Http;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

require __DIR__ . "/../../vendor/autoload.php";
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . "/../../");
$dotenv->load();
class Auth
{
    public static function createToken(array $data, string $role = 'user'): string
    {
        $payload = [
            'iss' => $_SERVER['REMOTE_ADDR'],
            'iat' => time(),
            'exp' => time() + (3600 * 12),
            'sub' => $data,
            'role' => $role
        ];

        $jwt = JWT::encode($payload, $_ENV["JWT_KEY"], 'HS256');

        return $jwt;
    }

    public static function decode()
    {
        $token = Request::getAuthToken();

        if (!$token) {
            throw new Exception("Cant get auth token");
        }

        $decoded = JWT::decode($token, new Key($_ENV["JWT_KEY"], 'HS256'));

        return $decoded;
    }

    public static function verify()
    {
        try {
            $decoded = self::decode();
        } catch (Exception $e) {
            return false;
        }

        return true;
    }

    public static function has(string $role): bool
    {
        $decoded = self::decode();

        return $decoded->role === $role ? true : false;
    }
}
