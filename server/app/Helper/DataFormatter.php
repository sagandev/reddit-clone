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

    public static function timestamp(string $starttime) : string 
    {
        $starttime = strtotime($starttime);
        $now = time();

        $diff = $now - $starttime;

        if ($diff < 60) {
            $timestamp = "{$diff} sec. ago";
        } else if ($diff >= 60 && $diff < 3600) {
            $timestamp = (int) ($diff / 60) . " min. ago";
        } else if ($diff >= 3600 && $diff < 86400) {
            $timestamp = (int) ($diff / 3600) . " hr. ago";
        } else if ($diff >= 86400 && $diff < 2592000) {
            $timestamp = (int) ($diff / 86400) . " day(s). ago";
        } else if ($diff >= 2592000 && $diff < 31104000) {
            $timestamp = (int) ($diff / 2592000) . " mon. ago";
        } else if ($diff >= 31104000){
            $timestamp = (int) ($diff / 2592000) . " yr(s). ago";
        }

        return $timestamp;
    }
}
