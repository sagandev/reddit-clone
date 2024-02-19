<?php

require __DIR__ . '/../vendor/autoload.php';
use App\Controllers\PostController;

$post = new PostController();

$post->handle();