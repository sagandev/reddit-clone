<?php

namespace App\Helper;



class Validator
{
    public static function csrfValidate(string $csrfToken): bool
    {
        if (!hash_equals($_SESSION['csrfToken'], $csrfToken)) {
            return false;
        }

        return true;
    }

    public static function generateToken(): string
    {
        $token = bin2hex(random_bytes(40));
        return $token;
    }

    public static function checkIfTokenExists(): bool
    {
        if(!isset($_SESSION['csrfToken'])) {
            $token = self::generateToken();
            setcookie("CSRF_TOKEN", $token, ['path' => '/', 'samesite' => 'strict']);
            $_SESSION['csrfToken'] = $token;
            return true;
        }

        if(!isset($_COOKIE['CSRF_TOKEN'])){
            setcookie("CSRF_TOKEN", $_SESSION['csrfToken'], ['path' => '/', 'samesite' => 'strict']);
        }
        return true;
    }
}
