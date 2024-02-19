<?php

namespace App\Http;

class Response
{
    public static function send($status = 200, string $message = 'success', $data = null)
    {
        $response = [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];

        http_response_code($status);
        echo json_encode($response);
    }
}