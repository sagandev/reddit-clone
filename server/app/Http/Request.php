<?php

namespace App\Http;

class Request
{

    public static function getInputData()
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        if (empty($data)) {
            return null;
        }

        return $data;
    }
    public static function getMethod() : string
    {
        $method = $_SERVER['REQUEST_METHOD'];

        return $method;
    }

    public static function getParams()
    {
        $URI = $_SERVER['REQUEST_URI'];
        if (!$URI) {
            return null;
        }

        $URI_PARAMS = explode('/', $URI);

        return $URI_PARAMS;
    }

    public static function getAuthToken()
    {
        if (empty($_SERVER['HTTP_AUTHORIZATION'])) {
            Response::send(400, 'Bad Request - Authorization');
            exit; 
        }
        $authHeader = explode(' ', $_SERVER['HTTP_AUTHORIZATION']);
        if (empty($authHeader[1]) || $authHeader[0] !== 'Bearer') {
            Response::send(400, 'Bad Request - Authorization');
            exit;
        }
        $authToken = $authHeader[1];
        return $authToken;
    }
}