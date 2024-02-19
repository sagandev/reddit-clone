<?php

namespace App\Controllers;

require __DIR__ . '/../../vendor/autoload.php';
use App\Models\User;
use App\Http\Response;
use App\Http\Request;
use App\Helper\DataFormatter;

class UserController
{
    public $user;

    public function __construct()
    {
        $this->user = new User();
    }

    public function handle() : void
    {
        $method = Request::getMethod();
        $data = Request::getInputData();

        switch ($method) {
            case 'POST':
                if (empty($data['email']) || empty($data['password']) || empty($data['username'])) {
                    Response::send(400, 'You must provide all data');
                    exit;
                }

                if (!DataFormatter::email($data['email'])) {
                    Response::send(400, 'Wrong email syntax');
                    exit;
                }

                $user = $this->user->register($data['email'], $data['password'], $data['username']);
                if (!$user) {
                    Response::send(400, 'User already exists');
                    exit;
                }
                Response::send(200, 'User registered successfully');
                break;

                case 'GET':
                    $params = Request::getParams();
                    // 2 = Username index in params array
                    if(is_null($params[2])) {
                        Response::send(400, 'Missing parameters');
                        exit;
                    }

                    // 2 = Username index in params array
                    $user = $this->user->getUser($params[2]);

                    if (!$user) {
                        Response::send(404, 'Not found');
                        exit;
                    }

                    Response::send(200, 'success', $user);
                    break;

            default:
                Response::send(405, 'error');
                break;
        }
    }

}