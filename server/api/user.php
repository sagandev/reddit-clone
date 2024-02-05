<?php

require __DIR__ . '/../vendor/autoload.php';
use App\Controllers\UserController;

$URI = explode($_SERVER['REQUEST_URI'], '/');
$method = $_SERVER['REQUEST_METHOD'];
$URI_PARAM = $URI[2] ?? null;

$user = new UserController();

$user->handle();