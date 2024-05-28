<?php

namespace App\Models;

require __DIR__ . '/../../vendor/autoload.php';

use App\Helper\DataFormatter;
use Exception;
use Sqids\Sqids;

class Comment
{
    public $db;
    public $error;
    public $sqids;

    public function __construct()
    {
        $this->db = new Database();
        $this->sqids = new Sqids(minLength: 12, alphabet: $_ENV['SQIDS_ALPHA']);
    }

    public function addComment(string $content, string $postId, string $userId)
    {

        $content = DataFormatter::string($content);
        $postId = DataFormatter::string($postId);

        $postIdDecoded = implode($this->sqids->decode($postId));


        try {
            $this->db->prepare("SELECT id FROM posts WHERE id = :postId", [':postId' => $postIdDecoded]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }


        if ($this->db->numRows() == 0) {
            $this->error = "Can't find post";
            exit;
        }

        try {
            $this->db->prepare("INSERT INTO posts_comments (content, author_id, post_id) VALUES (:content, :authorId, :postId)", [':content' => $content, ':authorId' => $userId, ':postId' => $postIdDecoded]);
            $this->db->execute();
        } catch (Exception $e) {
            $this->error = $e;
            throw new Exception($e->getMessage());
        }

        $comment = [
            'content' => $content,
            'author_id' => $userId,
            'post_id' => $postId,
            'id' => $this->db->insertId()
        ];


        return $comment;
    }

    public function deleteComment(string $commentId, string $userId): bool
    {
        $commentId = DataFormatter::string($commentId);

        try {
            $this->db->prepare("DELETE FROM posts_comments WHERE id = :commentId AND author_id = :userId", [':commentId' => $commentId, ':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            $this->error = $e;
            throw new Exception($e->getMessage());
        }

        return true;
    }
}
