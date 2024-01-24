<?php
declare(strict_types=1);
require_once realpath(dirname(__FILE__)) . "/../config/config.php";
require_once realpath(dirname(__FILE__)) . "/../interfaces/Database.php";
class Database implements DatabaseInterface
{
    private string $dbHost = DB_HOST;
    private string $dbUser = DB_USER;
    private string $dbUserPass = DB_USER_PASSWORD;
    private string $dbName = DB_NAME;

    public $link;
    public $query;
    public $error;

    public function __construct() {
        $dsn = "mysql:host=" . $this->dbHost .";port=3306;dbname=" . $this->dbName;
        $options = [
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ];
        try {
            $this->link = new PDO($dsn, $this->dbUser, $this->dbUserPass, $options);
        } catch (PDOException $e) {
            die("Unable to connect with database: " . $e->getMessage());
        }

    }

    public function prepare(string $query, array $params = []) : void {
        $this->query = $this->link->prepare($query);
        if(!empty($params)) {
            foreach($params as $param => $value) {
                if(str_contains($query, $param)) {
                    $this->query->bindValue($param, $value);
                }
            }
        }
    }


    public function execute() : void {
        try {
            $this->query->execute();
        } catch (PDOException $e) {
            $this->error = $e->errorInfo;
            throw new Exception("Error while executing query; MESSAGE: " . $e->getMessage());
        }
    }

    public function fetchAssoc() {
        return $this->query->fetch(PDO::FETCH_ASSOC);
    }

    public function fetchAll() {
        return $this->query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function numRows() : int {
        return $this->query->rowCount();
    }

    public function __destruct() {
        $this->link = null;
    }
}