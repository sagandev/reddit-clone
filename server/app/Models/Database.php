<?php

namespace App\Models;

require __DIR__ . "/../../vendor/autoload.php";
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__ . "/../../");
$dotenv->load();
use PDO;
use PDOException;
use Exception;
class Database
{
    private string $dbHost;
    private string $dbUser;
    private string $dbUserPass;
    private string $dbName;

    public $link;
    public $query;
    public $error;

    public function __construct()
    {
        $this->dbHost = $_ENV["DB_HOST"];
        $this->dbUser = $_ENV["DB_USER"];
        $this->dbUserPass = $_ENV["DB_USER_PASSWORD"];
        $this->dbName = $_ENV["DB_NAME"];

        $this->connect();
    }

    public function connect() : void
    {
        $dsn = "mysql:host=" . $this->dbHost . ";port=3306;dbname=" . $this->dbName;
        $options = [
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ];
        try {
            $this->link = new PDO($dsn, $this->dbUser, $this->dbUserPass, $options);
        } catch (PDOException $e) {
            throw new Exception("Error while executing query; MESSAGE: " . $e->getMessage());
        }
    }

    public function prepare(string $query, array $params = []): void
    {
        $this->query = $this->link->prepare($query);
        if (!empty($params)) {
            foreach ($params as $param => $value) {
                if (str_contains($query, $param)) {
                    $this->query->bindValue($param, $value, PDO::PARAM_STR);
                }
            }
        }
    }


    public function execute(): void
    {
        try {
            $this->query->execute();
        } catch (PDOException $e) {
            $this->error = $e->errorInfo;
            throw new Exception("Error while executing query; MESSAGE: " . $e->getMessage());
        }
    }

    public function fetchAssoc()
    {
        return $this->query->fetch(PDO::FETCH_ASSOC);
    }

    public function fetchAll()
    {
        return $this->query->fetchAll(PDO::FETCH_ASSOC);
    }

    public function numRows(): int
    {
        return $this->query->rowCount();
    }

    public function __destruct()
    {
        $this->link = null;
    }
}
