<?php

class Respose implements ResponseInterface
{
    public array $response = [
        "status" => 'OK',
        "msg" => '',
        "data" => []

    ];
    public function __construct($response = []) {
        $this->response->status = $response->status;
        $this->response->msg = $reponse->msg;
        $this->response->data = $response->data;
    }

    public function send() {
        echo json_encode($response);
    }
}