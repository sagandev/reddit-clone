<?php

namespace App\Controllers;

use App\Http\Auth;
use App\Http\Request;
use App\Http\Response;
use App\Models\User;
class AuthController
{
    public $auth;
    public $user;

    public function __construct()
    {
        $this->auth = new Auth();
        $this->user = new User();
    }

    public function handle()
    {
        $method = Request::getMethod();
        $data = Request::getInputData();

        switch ($method) {
            case 'POST':
                if (empty($data['username']) || empty($data['password'])){
                    Response::send(400, 'You must provide all data');
                    exit;
                }

                $user = $this->user->login($data['username'], $data['password']);

                if (!$user) {
                    Response::send(401, 'Invalid username or password');
                    exit;
                }
                $token = $this->auth->createToken(['email' => $data['email']]);
                Response::send(200, 'Successfully logged in', ['token' => $token]);
                break;
            default:
                Response::send(405, 'error');
                break;
        }

    }
}