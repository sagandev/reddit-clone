<?php
$routes = __DIR__ . '/api/';
header("Access-Control-Allow-Origin: http://localhost:5173");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS, PUT');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
    header('Access-Control-Allow-Headers: Content-Type, Origin, Authorization, X-CSRF-TOKEN, X-Requested-With');
    exit;
}
session_start();
$URI = explode('/', $_SERVER['REQUEST_URI']);
$enpoint = explode('?', $URI[1]);
$URI_PART = $enpoint[0];
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
    case 'communities':
        require_once $routes . 'community.php';
        break;
    case 'comments':
        require_once $routes . 'comment.php';
        break;
    default:
        http_response_code(404);
        break;
}