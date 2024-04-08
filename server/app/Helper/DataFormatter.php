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

    public static function timestamp(string $starttime): string
    {
        date_default_timezone_set('Europe/Warsaw');
        $starttime = strtotime($starttime);
        $now = time();

        $diff = $now - $starttime;

        if ($diff < 60) {
            $timestamp = "{$diff} sec. ago";
        } elseif ($diff >= 60 && $diff < 3600) {
            $timestamp = floor($diff / 60) . " min. ago";
        } elseif ($diff >= 3600 && $diff < 86400) {
            $timestamp = floor($diff / 3600) . " hr. ago";
        } elseif ($diff >= 86400 && $diff < 2592000) {
            $timestamp = floor($diff / 86400) . " day(s). ago";
        } elseif ($diff >= 2592000 && $diff < 31104000) {
            $timestamp = floor($diff / 2592000) . " mon. ago";
        } elseif ($diff >= 31104000) {
            $timestamp = floor($diff / 2592000) . " yr(s). ago";
        }

        return $timestamp;
    }
}
