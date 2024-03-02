<?php

namespace App\Controllers;

use App\Http\Request;
use App\Http\Response;
use App\Models\Post;
use App\Http\Auth;
class PostController
{
    public $post;

    public function __construct()
    {
        $this->post = new Post();
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
                    $sort = $params['query']['sort'] ?? "upvotes";
                    $posts = $this->post->getPosts($sort);
                    Response::send(200, 'success', $posts);
                } else {
                    $post = $this->post->getPost($params['path'][2]);
                    Response::send(200, 'success', $post);
                }
                break;
            case 'POST':

                if(!Auth::verify()) {
                    Response::send(401, 'Missing authentication. Access not granted');
                    exit;
                }

                if (empty($data['title']) || empty($data['content']) || !is_bool($data['nsfw']) || empty($data['community_id'])) {
                    Response::send(400, 'Missing parameters', $data);
                    exit;
                }

                $user = Auth::decode();

                Response::send(200, 'success', $user);
                break;
            case 'DELETE':
                if(!Auth::verify()) {
                    Response::send(401, 'Missing authentication. Access not granted');
                    exit;
                }

                if (!array_key_exists(2, $params['path'])) {
                    Response::send(400, "Missing parameters");
                    exit;
                }
                $user = Auth::decode();
                $delete = $this->post->deletePost($params['path'][2], $user->sub->userId);

            default:
                Response::send(405, 'error');
                break;
        }

    }
}