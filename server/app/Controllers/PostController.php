<?php

namespace App\Controllers;

use App\Http\Request;
use App\Http\Response;
use App\Models\Post;
use App\Http\Auth;
use App\Models\CachePost;
use App\Models\File;
use App\Helper\Validator;

class PostController
{
    public $post;
    public $cache;
    public $file;

    public function __construct()
    {
        $this->post = new Post();
        $this->cache = new CachePost();
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
                    if (isset($params['query']['sort'])) {
                        if (empty($params['query']['sessionId']) || $params['query']['sessionId'] == "undefined"){
                            $sessionId = md5(rand() . microtime() . str_shuffle($_ENV['SESSION_ID_SECRET']));
                        } else {
                            $sessionId = $params['query']['sessionId'];
                        }
                        $data = ['posts' => [], 'sessionId' => $sessionId];
                        if (isset($params['query']['communityName'])) {
                            $posts = $this->post->getPosts($sort, $params['query']['communityName']);
                            $data['posts'] = $posts;
                        } else {
                            if(isset($params['query']['userName'])){
                                $posts = $this->post->getPosts($sort, null, $params['query']['userName']);
                                $data['posts'] = $posts;
                            } else {
                                if (empty($params['query']['fromPost'])) {
                                    $posts = $this->post->getPosts($sort);
                                    $this->cache->insert($sessionId, json_encode($posts));
                                    for ($i = 0; $i < 5; $i++) {
                                        if (!isset($posts[$i])) break;
                                        $data['posts'][] = $posts[$i];
                                    }
                                } else {
                                    $posts = $this->cache->get($sessionId, $params['query']['fromPost']);
                                    $data['posts'] = $posts;
                                }
                            } 
                        }
                    } else if ($params['query']['search']) {
                        if (empty($params['query']['search'])) {
                            Response::send(400, 'Missing search value');
                            exit;
                        }

                        $searchedPosts = $this->post->search($params['query']['search']);
                        Response::send(200, 'success', $searchedPosts);
                    }
                    Response::send(200, 'success', $data);
                } else {
                    $userId = null;
                    if (Request::getAuthToken()) {
                        if(!Auth::verify()){
                            Response::send(401, 'Missing authentication.');
                            exit;
                        }
                        $decoded = Auth::decode();
                        $userId = $decoded->sub->userId;
                    }

                    $post = $this->post->getPost($params['path'][2], $userId);
                    Response::send(200, 'success', $post);
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
                if(array_key_exists(2, $params['path'])) {
                    $userId = null;
                    if(!Auth::verify()) {
                        Response::send(401, 'Missing authentication.');
                        exit;
                    }
                    $user = Auth::decode();
                    $userId = $user->sub->userId;

                    if ($params['path'][2] == 'upvote') {
                        if (empty($data['postId'])) {
                            Response::send(400, 'Missing parameters upvote');
                            exit;
                        }
                        $upvote = $this->post->upvote($data['postId'], $userId);

                        if (!$upvote) {
                            Response::send(500, 'Internal Server Error');
                            exit;
                        }
                    } else if ($params['path'][2] == 'downvote') {
                        if (empty($data['postId'])) {
                            Response::send(400, 'Missing parameters downvote');
                            exit;
                        }
                        $downvote = $this->post->downvote($data['postId'], $userId);

                        if (!$downvote) {
                            Response::send(500, 'Internal Server Error');
                            exit;
                        }
                    } else {
                        Response::send(404, "Not found");
                        exit;
                    }
                } else {
                    if(!Auth::verify()) {
                        Response::send(401, 'Missing authentication.');
                        exit;
                    }
                    $user = Auth::decode();
                    $userId = $user->sub->userId;
                    if (empty($data['input']['title']) || empty($data['input']['nsfw']) || empty($data['input']['communityId'])) {
                        Response::send(400, 'Missing parameters', $data);
                        exit;
                    }
                    
                    if ($data['input']['nsfw'] != "true" && $data['input']['nsfw'] != "false" && !is_bool($data['input']['nsfw'])) {
                        Response::send(400, 'Bad request', $data);
                        exit;
                    }
                    $path = "/posts/";
                    $uploadName = null;
                    if (array_key_exists("file", $data['files'])){
                        $file = $data['files']['file'];
                        $upload = new File($path, $file);
                        //Validate

                        if ($upload->error) {
                            Response::send($upload->httpStatus, $upload->error);
                            exit;
                        }
                        $uploadName = $upload->name;

                    }
                    $this->post->addPost($data['input']['title'], $data['input']['content'], $data['input']['communityId'], $data['input']['nsfw'], $uploadName, $user->sub->userId);
                    Response::send(200, 'success', $this->post->postId);
                }
                break;
            case 'DELETE':
                $params = Request::getURI();
                if(!Auth::verify()) {
                    Response::send(401, 'Missing authentication.');
                    exit;
                }

                if (!array_key_exists(2, $params['path'])) {
                    Response::send(400, "Missing parameters");
                    exit;
                }
                $user = Auth::decode();
                $delete = $this->post->deletePost($params['path'][2], $user->sub->userId);

                // no break
                break;
            default:
                Response::send(405, 'error');
                break;
        }

    }
}
