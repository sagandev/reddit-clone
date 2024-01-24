<?php

require_once dirname(realpath(__FILE__)) . "/../libs/Database.php";
require_once dirname(realpath(__FILE__)) . "/../libs/Session.php";
require_once dirname(realpath(__FILE__)) . "/../helpers/DataFormatter.php";
class UserAuth
{
    public $db;
    public $df;

    public function __construct() {
        $this->db = new Database();
        $this->df = new DataFormatter();
    }

    public function login($email, $password) {
        $email = $this->df->email($email);
        $password = $this->df->string($password);

        try {
            $this->db->prepare("SELECT * FROM users WHERE user_email = :userEmail", [":userEmail" => $email]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception ($e->getMessage());
            exit();
        }

        if ($this->db->numRows() != 1) {
            return false;
        }

        $res = $this->db->fetchAssoc();
        $verPass = password_verify($password, $res["user_password"]);

        if(!$verPass) {
            return false;
        }

        unset($res["user_password"]);
        return $res;
    }

    public function register($email, $password) {
        $email = $this->df->email($email);
        $password = $this->df->string($password);
        
        try {
            $this->db->prepare("SELECT user_email FROM users WHERE user_email = :userEmail", [":userEmail" => $email]);
            $this->db->execute();
        } catch(Exception $e) {
            throw new Exception ($e->getMessage());
            exit;
        }

        if ($this->db->numRows() >= 1) {
            return false;
        }

        $password = password_hash($password, PASSWORD_DEFAULT);

        try{
            $this->db->prepare("INSERT INTO users (user_email, user_password) VALUES ('{$email}', '{$password}');");
            $this->db->execute();
        } catch(Exception $e) {
            throw new Exception ($e->getMessage());
            exit;
        }
        
        return true;

    }
}