<?php
declare(strict_types=1);
require_once realpath(dirname(__FILE__)) . "/../interfaces/Session.php";
class Session implements SessionInterface
{
    public static function init() : void {
        session_start();
    }

    public static function set(string $name, $value) : void {
        $_SESSION[$name] = $value;
    }

    public static function get(string $name) {
        return $_SESSION[$name] ?? false;
    }

    public static function checkIsUserAlreadyLogged() : void {
        if(self::get("user")) {
            header("location: /app");
        }
    }

    public static function checkIsUserLogged() : void {
        if(!self::get("user")) {
            header("location: ../");
        }
    }
    public static function authorized() : bool {
        if(!self::get("user")){
            return false;
        }

        return true;
    }
    public static function destroy(): void {
        session_destroy();
        session_unset();
    }
}