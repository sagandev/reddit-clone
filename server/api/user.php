<?php

require __DIR__ . '/../vendor/autoload.php';
use App\Controllers\UserController;

$user = new UserController();

$user->handle();