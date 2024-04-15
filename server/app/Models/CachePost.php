<?php
namespace App\Models;

require __DIR__ . '/../../vendor/autoload.php';

use Redis;

class CachePost
{
    public $hostname;
    public $password;
    public $redis;

    public function __construct()
    {

        $this->redis = new Redis();

        $this->redis->connect('127.0.0.1', 6379);
        $this->redis->auth('8L7nc1iOi1XU96u156');
    }

    public function insert($sessionId, $data)
    {
        $set = $this->redis->setEx('session:'.$sessionId, 3600 * 12, $data);

        return $set;
    }

    public function get(string $sessionId, int $from) : array
    {
        $data = $this->redis->getEx('session:'.$sessionId);
        
        $data = json_decode($data);

        $from = intval($from);

        $res = [];

        for ($i = $from; $i < $from + 5; $i++) {
            if (!$data[$i]) break;
            $res[] = $data[$i];
        }

        return $res;
    }
}