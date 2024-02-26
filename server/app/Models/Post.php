<?php

declare(strict_types=1);

namespace App\Models;

require __DIR__ . '/../../vendor/autoload.php';
use App\Helper\DataFormatter;
use Exception;

class Post
{
    public $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function getPosts(string $orderType)
    {
        try {
            $this->db->prepare("SELECT posts.id, title, content, upvotes, downvotes, posts.created_at, username AS author, (SELECT COUNT(posts_comments.id) FROM posts_comments WHERE posts_comments.post_id = posts.id) AS comments, communities.name AS community_name FROM posts INNER JOIN users ON posts.author_id = users.id INNER JOIN communities ON posts.community_id = communities.id ORDER BY $orderType DESC LIMIT 100;");
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
        if ($this->db->numRows() < 1) {
            return null;
        }

        $data = $this->db->fetchAll();

        foreach ($data as &$post) {
            $post['timestamp'] = DataFormatter::timestamp($post['created_at']);
        }

        return $data;
    }

    public function getPost(string $postId) 
    {

        $data = [
            'post' => null,
            'comments' => null
        ];

        try {
            $this->db->prepare("SELECT id, title, content, upvotes, downvotes, posts.created_at, username AS author, communities.name AS community_name FROM posts INNER JOIN users ON posts.author_id = users.id INNER JOIN communities ON posts.community_id = communities.id WHERE posts.id = :postId", [':postId' => $postId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
        if ($this->db->numRows() < 1) {
            return null;
        }

        $post = $this->db->fetchAssoc();

        $post['timestamp'] = DataFormatter::timestamp($post['created_at']);

        try {
            $this->db->prepare("SELECT * FROM posts_comments WHERE post_id = :postId", [':postId' => $postId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        $comments = $this->db->fetchAll();

        $data['post'] = $post;

        $data['comments'] = $comments;

        foreach ($data['comments'] as &$comment) {
            $comment['created_at'] = DataFormatter::timestamp($comment['created_at']);
        }

        return $data;
    }

    public function addPost(string $title, string $content, int $communityId, bool $nsfw = false): bool
    {
        $title = DataFormatter::string($title);
        $content = DataFormatter::string($content);

        if(!is_bool($nsfw) || !is_int($communityId)) exit;



        try {
            $this->db->prepare("INSERT INTO posts (title, content, community_id, nsfw) VALUES(:title, :content, :communityId, :nsfw)", [':title' => $title, ':content' => $content, ':communityId' => $communityId, ':nsfw' => $nsfw]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        return true;
    }
    public function deleteTask(string $list, string $taskId, string $userId): bool
    {
        try {
            $this->db->prepare("DELETE FROM :list WHERE task_id = :taskId AND user_id = :userId", [":list" => $list . "_tasks_list", ":taskId" => $taskId, ":userId" => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        return true;
    }
}
