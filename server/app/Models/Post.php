<?php

declare(strict_types=1);

namespace App\Models;

require __DIR__ . '/../../vendor/autoload.php';
use App\Helper\DataFormatter;


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
            $this->db->prepare("SELECT title, content, upvotes, downvotes, posts.created_at, username AS author, (SELECT COUNT(posts_comments.id) FROM posts_comments WHERE posts_comments.post_id = posts.id) AS comments, communities.name AS community_name FROM posts INNER JOIN users ON posts.author_id = users.id INNER JOIN communities ON posts.community_id = communities.id ORDER BY :orderType LIMIT 100;", ['orderType' => $orderType]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
            exit();
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
    public function addTask(string $list, string $taskContent, string $userId): bool
    {
        try {
            $this->db->prepare("INSERT INTO :list (user_id, task_content) VALUES (:userId, :taskContent)", [":list" => $list . "_tasks_list", ":taskContent" => $taskContent, ":userId" => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
            exit();
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
            exit();
        }

        return true;
    }
}
