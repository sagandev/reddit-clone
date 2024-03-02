<?php

namespace App\Controllers;

use App\Http\Request;
use App\Http\Response;
use App\Models\Comment;
use App\Http\Auth;
class CommentController
{
    public $comment;

    public function __construct()
    {
        $this->comment = new Comment();
    }

    public function handle()
    {
        $method = Request::getMethod();
        $data = Request::getInputData();

        switch ($method) {
            case 'POST':
                if (empty($data['postId']) || empty($data['commentContent'])){
                    Request::send(400, 'Missing data');
                    exit;
                }

                if (!Auth::verify()) {
                    Response::send(401, 'Missing authentication. Access not granted');
                    exit;
                }

                $user = Auth::decode();

                $comment = $this->addComment($data['content'], $user->sub->userId);

                if ($this->comment->error) {
                    Response::send(500, $this->comment->error);
                    exit;
                }

                Response::send(200, 'success');

                break;
            case 'DELETE':
                $params = Request::getURI();

                if (!array_key_exists(2, $params['path'])) {
                    Response::send(400, 'Missing parameters');
                    exit;
                }

                if (!Auth::verify()) {
                    Response::send(401, 'Missing authentication. Access not granted');
                    exit;
                }

                $user = Auth::decode();

                $comment = $this->deleteComment($params['path'][2], $user->sub->userId);

                if ($this->comment->error) {
                    Response::send(500, $this->comment->error);
                    exit;
                }

                Response::send(200, 'success');
                break;
            default:
                Response::send(405, 'error');
                break;
        }

    }
}