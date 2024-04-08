<?php

namespace App\Controllers;

use App\Http\Request;
use App\Http\Response;
use App\Models\Community;
use App\Http\Auth;

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
                if(!array_key_exists(2, $params['path'])) {
                    if(!array_key_exists("search", $params['query'])) {
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

                if(!Auth::verify()) {
                    Response::send(401, 'Missing authentication. Access not granted');
                    exit;
                }

                if (empty($data['name']) || !is_bool($data['nsfw'])) {
                    Response::send(400, 'Missing parameters', $data);
                    exit;
                }

                $user = Auth::decode();

                $community = $this->community->createCommunity($data['name'], $data['description'], $user['data']['userId'], $data['nsfw']);

                Response::send(200, 'success');
                break;
            default:
                Response::send(405, 'error');
                break;
        }

    }
}
