<?php
$routes = __DIR__ . '/api/';
header('Access-Control-Allow-Origin: 127.0.0.1:3000');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, DELETE');
header('Content-Type: application/json');

$URI = explode('/', $_SERVER['REQUEST_URI']);
$URI_PART = $URI[1];
switch ($URI_PART) {
    case 'users':
        require_once $routes . 'user.php';
        break;
    case 'auth':
        require_once $routes . 'auth.php';
        break;
    case 'posts':
        require_once $routes . 'post.php';
        break;
    default:
        http_response_code(404);
        break;
}