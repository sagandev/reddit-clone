<?php

require __DIR__ . '/../vendor/autoload.php';
use App\Controllers\CommentController;

$comment = new CommentController();

$comment->handle();