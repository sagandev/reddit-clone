<?php

namespace App\Models;

require __DIR__ . '/../../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__ . "/../../");
$dotenv->load();
use Redis;

class CachePost
{
    public $host;
    public $password;
    public $redis;

    public function __construct()
    {
        $this->host = $_ENV['REDIS_HOST'];
        $this->password = $_ENV['REDIS_PASSWORD'];

        $this->init();
    }

    public function init()
    {
        $this->redis = new Redis();
        $this->redis->connect($this->host, 6379);
        $this->redis->auth($this->password);
    }

    public function insert($sessionId, $data)
    {
        $set = $this->redis->setEx('session:' . $sessionId, 3600 * 12, $data);

        return $set;
    }

    public function get(string $sessionId, int $from): array
    {
        $data = $this->redis->getEx('session:' . $sessionId);

        $data = json_decode($data);

        $from = intval($from);

        $res = [];

        for ($i = $from; $i < $from + 5; $i++) {
            if (!isset($data[$i])) break;
            $res[] = $data[$i];
        }

        return $res;
    }
}
