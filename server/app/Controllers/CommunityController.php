<?php

namespace App\Controllers;

use App\Http\Request;
use App\Http\Response;
use App\Models\Community;
use App\Http\Auth;
use App\Models\File;
use App\Helper\Validator;


class CommunityController
{
    public $community;

    public function __construct()
    {
        $this->community = new Community();
    }

    public function handle()
    {
        $method = Request::getMethod();
        $data = Request::getInputData();

        switch ($method) {
            case 'GET':
                $params = Request::getURI();
                // 2 = PostId index in params array
                if (!array_key_exists(2, $params['path'])) {
                    if (!array_key_exists("search", $params['query'])) {
                        $communities = $this->community->getTopCommunities();
                    } else {
                        $search = $params['query']['search'];
                        $communities = $this->community->getCommunities($search);
                    }
                    Response::send(200, 'success', $communities);
                } else {
                    $community = $this->community->getCommunity($params['path'][2]);
                    Response::send(200, 'success', $community);
                }
                break;
            case 'POST':
                $params = Request::getURI();
                $csrf = Request::getHeader('HTTP_X_CSRF_TOKEN');
                $validate = Validator::csrfValidate($_SESSION['csrfToken'], $csrf);
                if (!$validate) {
                    Response::send(403, 'Forbidden');
                    exit;
                }
                if (!Auth::verify()) {
                    Response::send(401, 'Missing authentication.');
                    exit;
                }
                $user = Auth::decode();
                if (!array_key_exists(2, $params['path'])) {
                    if (empty($data['input']['name']) || empty($data['input']['description']) || empty($data['input']['nsfw']) || ($data['input']['nsfw'] != 'false' && $data['input']['nsfw'] != 'true')) {
                        Response::send(400, 'Missing parameters', $data);
                        exit;
                    }

                    $user = Auth::decode();
                    $fileName = null;
                    if ($data['files']['file']) {
                        $file = new File('/communities/', $data['files']['file']);

                        if (!$file) {
                            Response::send($file->httpStatus, $file->error);
                            exit;
                        }
                        $fileName = $file->name;
                    }
                    $community = $this->community->createCommunity($data['input']['name'], $data['input']['description'], $data['input']['nsfw'], $fileName, $user->sub->userId);

                    Response::send(200, 'success');
                } elseif ($params['path'][2] == "join") {
                    if (empty($data['communityId'])) {
                        Response::send(400, "Missing parameters");
                        exit;
                    }

                    $join = $this->community->join($data['communityId'], $user->sub->userId);

                    if (!$join) {
                        Response::send($this->community->httpStatus, $this->community->error);
                        exit;
                    }

                    Response::send(200, "OK");
                } elseif ($params['path'][2] == "edit") {
                    if (!array_key_exists(3, $params['path'])) {
                        if (empty($data['name']) || empty($data['description']) || empty($data['nsfw']) || empty($data['communityId'])) {
                            Response::send(400, "Missing parameters");
                            exit;
                        }
                        var_dump($data);

                        $edit = $this->community->edit($data['name'], $data['description'], $data['nsfw'], $user->sub->userId, $data['communityId']);

                        if (!$edit) {
                            Response::send($this->community->httpStatus, $this->community->error);
                            exit;
                        }

                        Response::send(200, "OK");
                    } elseif ($params['path'][3] == "icon") {
                        if (!array_key_exists('file', $data['files'])) {
                            Response::send(400, "Missing parameters");
                            exit;
                        }

                        $path = "/communities/";
                        $upload = new File($path, $data['files']['file'], $data['input']['oldFileName']);

                        if (!$upload) {
                            Response::send($upload->httpStatus, $upload->error);
                            exit;
                        }

                        $fileName = $upload->name;

                        $editIcon = $this->community->editIcon($fileName, $user->sub->userId, $data['input']['communityId']);

                        if (!$editIcon) {
                            Response::send($this->community->httpStatus, $this->community->error);
                            exit;
                        }

                        Response::send(200, "OK");
                    } else {
                        Response::send(404, "Not Found");
                    }
                } else {
                    Response::send(404, "Not Found");
                }
                break;
            default:
                Response::send(405, 'error');
                break;
        }
    }
}
