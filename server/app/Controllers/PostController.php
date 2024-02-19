<?php

namespace App\Controllers;

use App\Http\Request;
use App\Http\Response;
use App\Models\Post;
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
                $params = Request::getParams();
                // 2 = PostId index in params array
                if(!array_key_exists(2, $params)) {
                    $sort = $data['sort'] ?? "upvotes";
                    $posts = $this->post->getPosts($sort);
                    Response::send(200, 'success', $posts);
                }
                break;
            default:
                Response::send(405, 'error');
                break;
        }

    }
}