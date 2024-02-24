<?php

namespace App\Http;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use Firebase\JWT\BeforeValidException;
use Firebase\JWT\ExpiredException;
use DomainException;
use InvalidArgumentException;
use UnexpectedValueException;
use Exception;
require __DIR__ . "/../../vendor/autoload.php";
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__ . "/../../");
$dotenv->load();
class Auth
{

    public static function createToken(array $data, string $role = 'user') : string
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

    public static function has(string $role) : bool
    {
        $decoded = self::decode();

        return $decoded->role === $role ? true : false;
    }
}