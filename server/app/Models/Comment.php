<?php
namespace App\Models;

require __DIR__ . '/../../vendor/autoload.php';
use App\Helper\DataFormatter;
use Exception;

class Comment 
{
    public $db;
    public $error;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function addComment(string $content, string $postId, string $userId)
    {

        $content = DataFormatter::string($content);

        try {
            $this->db->prepare("SELECT id FROM posts WHERE id = :postId", [':postId' => $postId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }


        if ($this->db->numRows() == 0) {
            $this->error = "Can't find post";
            exit;
        }

        try {
            $this->db->prepare("INSERT INTO posts_comments (content, author_id, post_id) VALUES (:content, :authorId, :postId)", [':content' => $content, ':authorId' => $userId, ':postId' => $postId]);
            $this->db->execute();
        } catch (Exception $e) {
            $this->error = $e;
            throw new Exception($e->getMessage());
        }

        return true;
    }
}