<?php

namespace App\Http;

class Response
{
    public static function send($status = 200, string $msg = 'success', $data = null)
    {
        $response = [
            'status' => $status,
            'msg' => $msg,
            'data' => $data
        ];

        http_response_code($status);
        echo json_encode($response);
    }
}