<?php

namespace App\Helper;

class DataFormatter
{
    public static function string(string $str): string
    {
        return htmlspecialchars(stripcslashes(trim($str)));
    }

    public static function email(string $str)
    {
        $str = filter_var($str, FILTER_SANITIZE_EMAIL);
        $check = filter_var($str, FILTER_VALIDATE_EMAIL);
        if (!$check) {
            return false;
        } else {
            return $str;
        }
    }

    public static function validatePassword(string $password): bool
    {
        $regex = "/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/";
        if (!preg_match($regex, $password)) {
            return false;
        }
        return true;
    }
}
