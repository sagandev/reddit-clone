<?php

namespace App\Controllers;

require __DIR__ . '/../../vendor/autoload.php';

use App\Models\User;
use App\Http\Response;
use App\Http\Request;
use App\Helper\DataFormatter;
use App\Http\Auth;
use App\Models\File;
use App\Helper\Validator;
use App\Models\Mailer;

class UserController
{
    public $user;
    public $rateLimiter;
    public $file;
    public $mailer;

    public function __construct()
    {
        $this->user = new User();
        $this->mailer = new Mailer();
    }

    public function handle(): void
    {
        $method = Request::getMethod();
        $data = Request::getInputData();

        Validator::checkIfTokenExists();

        switch ($method) {
            case 'POST':
                $params = Request::getURI();
                $csrf = Request::getHeader('HTTP_X_CSRF_TOKEN');
                $validate = Validator::csrfValidate($csrf);
                if (!$validate) {
                    Response::send(403, 'Forbidden');
                    exit;
                }
                if (!array_key_exists(2, $params['path'])) {
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
                    $this->mailer->send($data['email'], "[sagandev.pl] Account activation", "Here's your activation link <br><br>Click this: <a href='http://localhost:5173/activate-account?email=".$this->user->user['email']."&code=".$this->user->user['secret_key']."' target='_blank'>activate</a><br><br><b style='font-size: xx-large'>Do not share this with anybody!</b>");
                    if($this->mailer->error) {
                        Response::send(500, $this->mailer->error);
                        exit;
                    }
                    Response::send(200, 'User registered successfully');
                } elseif ($params['path'][2] == "settings") {
                    if (!Auth::verify()) {
                        Response::send(401, 'Unauthorized');
                        exit;
                    }
                    //var_dump($params);
                    $user = Auth::decode();
                    if (array_key_exists(3, $params['path'])) {
                        switch ($params['path'][3]) {
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
                            case 'avatar':
                                $path = "/users/";
                                if (!$data['files']) {
                                    Response::send(400, "Missing file");
                                    exit;
                                }
                                $userData = $this->user->getUserById($user->sub->userId);
                                $oldAvatar = $userData['avatar'];
                                $file = $data['files']['file'];
                                $upload = new File($path, $file, $oldAvatar);
                                if ($upload->error) {
                                    Response::send($upload->httpStatus, $upload->error);
                                    exit;
                                }
                                $newName = $upload->name;
                                $this->user->updateAvatar($user->sub->userId, $newName);
                                Response::send(200, 'success', $newName);
                                break;
                            default:
                                Response::send(404, 'Not found');
                                break;
                        }
                    } else {
                        Response::send(404, "Not found");
                        exit;
                    }
                } elseif ($params['path'][2] == "set-password") {
                    if (empty($data['email']) || empty($data['password']) || empty($data['key'])) {
                        Response::send(400, "Missing parameters");
                        exit;
                    }

                    $setPass = $this->user->setPassword($data['email'], $data['password'], $data['key']);

                    if(!$setPass) {
                        Response::send($this->user->httpStatus, $this->user->error);
                        exit;
                    }
                    Response::send(200, 'OK');
                } elseif ($params['path'][2] == "activate"){
                    if (empty($data['email']) || empty($data['key'])) {
                        Response::send(400, "Missing parameters");
                        exit;
                    }

                    $activate = $this->user->activate($data['email'], $data['key']);

                    if(!$activate) {
                        Response::send($this->user->httpStatus, $this->user->error);
                        exit;
                    }

                    Response::send(200, "OK");
                } else {
                    Response::send(404, "Not found");
                    exit;
                }
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
                    $user = $this->user->getUserByUsername($params['path'][2]);

                    if (!$user) {
                        Response::send(404, 'Not found');
                        exit;
                    }
                }

                Response::send(200, 'success', $user);
                break;
            default:
                Response::send(405, 'error');
                break;
        }
    }
}
