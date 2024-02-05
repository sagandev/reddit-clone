<?php

namespace App\Controllers;

use App\Http\Auth;
use App\Http\Request;
use App\Http\Response;
class AuthController
{
    public $auth;
    public $req;

    public function __construct()
    {
        $this->auth = new Auth();
        $this->req = new Request();
    }

    public function handle()
    {
        $data = $this->req->getInputData();

        $token = $this->auth->createToken(['email' => $data['email']]);

        Response::send(200, 'Token', ['token' => $token]);
    }
}