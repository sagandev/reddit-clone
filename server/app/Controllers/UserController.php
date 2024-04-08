<?php

namespace App\Controllers;

require __DIR__ . '/../../vendor/autoload.php';

use App\Models\User;
use App\Http\Response;
use App\Http\Request;
use App\Helper\DataFormatter;
use App\Http\Auth;

class UserController
{
    public $user;

    public function __construct()
    {
        $this->user = new User();
    }

    public function handle(): void
    {
        $method = Request::getMethod();
        $data = Request::getInputData();
        switch ($method) {
            case 'POST':
                if (empty($data['email']) || empty($data['password']) || empty($data['username'])) {
                    Response::send(400, 'Missing parameters');
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
                $params = Request::getURI();
                // 2 = Username index in params array
                if (is_null($params['path'][2])) {
                    Response::send(400, 'Missing parameters');
                    exit;
                }

                if (array_key_exists(3, $params['path'])) {
                    switch ($params['path'][3]) {
                        case 'communities':
                            $user = $this->user->getUserCommunities($params['path'][2]);
                            break;
                        default:
                            Response::send(404, 'Bad endpoint');
                            exit;
                    }
                } else {
                    // 2 = Username index in params array
                    var_dump($params['path'][2]);
                    $user = $this->user->getUser($params['path'][2]);

                    if (!$user) {
                        Response::send(404, 'Not found');
                        exit;
                    }
                }

                Response::send(200, 'success', $user);
                break;
            case 'PUT':
                $data = Request::getInputData();
                $params = Request::getURI();

                if (!Auth::verify()) {
                    Response::send(401, 'Unauthorized');
                    exit;
                }

                $user = Auth::decode();

                if(array_key_exists(3, $params['path'])){
                    switch($params['path'][3]){
                        case 'password':
                            if (empty($data['input']['newPassword'])) {
                                Response::send(400, 'Missing parameters');
                                exit;
                            }

                            if (strlen($data['input']['newPassword']) <= 8) {
                                Response::send(400, 'Password must be equal or longer than 8 characters');
                                exit;
                            }

                            $newPassword = $data['input']['newPassword'];

                            $update = $this->user->updatePassword($user->sub->userId, $newPassword);

                            if (!$update) {
                                Response::send(500, 'Password update process failed');
                                exit;
                            }

                            Response::send(200, 'Password changed successfully');
                            break;
                        case 'personal':
                            break;
                        default:
                            Response::send(404, 'Not found');
                            break;
                    }
                }
                break;
            default:
                Response::send(405, 'error');
                break;
        }
    }
}
