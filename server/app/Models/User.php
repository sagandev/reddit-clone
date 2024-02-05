<?php

namespace App\Models;

require __DIR__ . '/../../vendor/autoload.php';
use App\Helper\DataFormatter;

class User
{
    public $db;
    public $df;

    public function __construct()
    {
        $this->db = new Database();
        $this->df = new DataFormatter();
    }

    public function login($email, $password)
    {
        $email = $this->df->email($email);
        $password = $this->df->string($password);

        try {
            $this->db->prepare("SELECT * FROM users WHERE email = :userEmail", [":userEmail" => $email]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
            exit();
        }

        if ($this->db->numRows() != 1) {
            return false;
        }

        $res = $this->db->fetchAssoc();
        $verPass = password_verify($password, $res["password"]);

        if (!$verPass) {
            return false;
        }

        unset($res["password"]);
        return $res;
    }

    public function register($email, $password)
    {
        $email = $this->df->email($email);
        $password = $this->df->string($password);

        try {
            $this->db->prepare("SELECT email FROM users WHERE email = :userEmail", [":userEmail" => $email]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
            exit;
        }

        if ($this->db->numRows() >= 1) {
            return false;
        }

        $password = password_hash($password, PASSWORD_DEFAULT);

        try {
            $this->db->prepare("INSERT INTO users (email, password) VALUES ('{$email}', '{$password}');");
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
            exit;
        }

        return true;
    }
}
