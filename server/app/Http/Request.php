<?php

namespace App\Http;

class Request
{
    public static function getInputData()
    {
        $input = file_get_contents('php://input');
        if (isset($_SERVER['CONTENT_TYPE'])){
            $contentType = explode(";", $_SERVER['CONTENT_TYPE']);
            if ($contentType[0] == "multipart/form-data") {
                $data = [
                    'input' => $_POST,
                    'files' => $_FILES
                ];
            } else {
                $data = json_decode($input, true);
            }
        } else {
            $data = json_decode($input, true);
        }

        return $data;
    }
    public static function getMethod(): string
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
            return false;
        }
        $authHeader = explode(' ', $_SERVER['HTTP_AUTHORIZATION']);
        if (empty($authHeader[1]) || $authHeader[0] !== 'Bearer') {
            return false;
        }
        $authToken = $authHeader[1];
        return $authToken;
    }
}
