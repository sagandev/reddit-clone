<?php

namespace App\Helper;



class Validator
{
    public static function csrfValidate(string $sessionToken, string $csrfToken): bool|string
    {

        if (!hash_equals($sessionToken, $csrfToken)) {
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
        return isset($_SESSION['csrfToken']) ? true : false;
    }
}
