<?php
interface SessionInterface
{
    public static function init();
    public static function set(string $name, $value);
    public static function get(string $name);
    public static function checkIsUserAlreadyLogged();
    public static function checkIsUserLogged();
    public static function authorized();
}