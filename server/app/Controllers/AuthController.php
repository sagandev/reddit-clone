<?php

namespace App\Controllers;

use App\Http\Auth;
use App\Http\Request;
use App\Http\Response;
use App\Models\User;
use App\Helper\Validator;
use App\Models\Mailer;

class AuthController
{
    public $auth;
    public $user;
    public $mailer;

    public function __construct()
    {
        $this->auth = new Auth();
        $this->user = new User();
        $this->mailer = new Mailer();
    }

    public function handle()
    {
        $method = Request::getMethod();
        $data = Request::getInputData();

        switch ($method) {
            case 'POST':
                $params = Request::getURI();
                if (array_key_exists(2, $params['path'])) {
                    switch ($params['path'][2]) {
                        case 'token':
                            $token = Validator::generateToken();
                            $_SESSION['csrfToken'] = $token;
                            Response::send(200, "OK", $token);
                            break;
                        case 'password-recovery':
                            if (empty($data['email'])) {
                                Response::send(400, 'Missing parameters');
                                exit;
                            }

                            $rec = $this->user->passwordRecovery($data['email']);
                            if(!$rec) {
                                Response::send(400, $this->user->error);
                                exit;
                            }

                            $this->mailer->send($this->user->user['email'], "[sagandev.pl] Account recovery", "Here's your recovery code: ".$this->user->user['secret_key']."<br><br>Or click this: <a href='http://localhost:5173/set-password?email=".$this->user->user['email']."&code=".$this->user->user['secret_key']."' target='_blank'>recover</a><br><br><b style='font-size: xx-large'>Do not share these codes with anybody!</b>");

                            if($this->mailer->error) {
                                Response::send(500, $this->mailer->error);
                                exit;
                            }

                            Response::send(200, "OK");
                            break;
                        default:
                            Response::send(404, 'Not found');
                            break;
                    }
                } else {
                    $csrf = Request::getHeader('HTTP_X_CSRF_TOKEN');
                    // $validate = Validator::csrfValidate($_SESSION['csrfToken'], $csrf);
                    // if (!$validate) {
                    //     Response::send(403, 'Forbidden');
                    //     exit;
                    // }
                    if (empty($data['email']) || empty($data['password'])) {
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
                }
                break;

            default:
                Response::send(405, 'error');
                break;
        }
    }
}
