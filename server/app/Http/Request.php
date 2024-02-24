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

    public static function getURI()
    {
        $URI = $_SERVER['REQUEST_URI'];
        $query = parse_url($URI, PHP_URL_QUERY);
        $path = parse_url($URI, PHP_URL_PATH);
        parse_str($query, $outputQuery);
        $array = [
            'path' => explode('/', $path),
            'query' => $outputQuery
        ];
        return $array;
    }

    public static function getAuthToken()
    {
        if (empty($_SERVER['HTTP_AUTHORIZATION'])) {
            Response::send(401, 'Missing Authentication. Access not granted');
            exit; 
        }
        $authHeader = explode(' ', $_SERVER['HTTP_AUTHORIZATION']);
        if (empty($authHeader[1]) || $authHeader[0] !== 'Bearer') {
            Response::send(400, 'Missing Authentication. Access not granted');
            exit;
        }
        $authToken = $authHeader[1];
        return $authToken;
    }
}