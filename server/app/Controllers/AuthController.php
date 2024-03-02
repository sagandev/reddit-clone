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
                if (empty($data['email']) || empty($data['password'])){
                    Response::send(200, 'Missing parameters', $data);
                    exit;
                }

                $user = $this->user->login($data['email'], $data['password']);

                if (!$user) {
                    Response::send(401, 'Invalid email or password');
                    exit;
                }
                $token = $this->auth->createToken(['email' => $data['email'], 'userId' => $user['id']]);
                Response::send(200, 'Successfully logged in', ['token' => $token, 'user' => $user]);
                break;
            default:
                Response::send(405, 'error');
                break;
        }

    }
}