<?php
$redis = new Redis();

$redis->connect('127.0.0.1',6379);
$redis->auth("8L7nc1iOi1XU96u156");

$ping = $redis->ping('hello');

echo $ping;