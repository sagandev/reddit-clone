<?php

require __DIR__ . '/../vendor/autoload.php';
use App\Controllers\AuthController;

$user = new AuthController();

$user->handle();