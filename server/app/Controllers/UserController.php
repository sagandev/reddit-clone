<?php

namespace App\Controllers;

require __DIR__ . '/../../vendor/autoload.php';
use App\Models\User;
use App\Http\Response;
use App\Http\Request;
class UserController
{
    public $user;
    public $response;

    public function __construct()
    {
        $this->user = new User();
    }

    public function handle() : void
    {
        $res = Request::getInputData();

        if ($res === null) {
            Response::send(400, 'Data', $res);
            exit;
        }

        Response::send(200, 'Data', $res);
    }

}