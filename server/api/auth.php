<?php

require __DIR__ . '/../vendor/autoload.php';
use App\Controllers\AuthController;

$auth = new AuthController();

$auth->handle();