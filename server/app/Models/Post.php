<?php

declare(strict_types=1);

namespace App\Models;

require __DIR__ . '/../../vendor/autoload.php';
use Dotenv\Dotenv;
use App\Helper\DataFormatter;
use Exception;
use Sqids\Sqids;

class Post
{
    public $db;
    public $error;
    public $sqids;
    public $postId;

    public function __construct()
    {
        $this->db = new Database();
        $this->sqids = new Sqids(minLength:12, alphabet: $_ENV['SQIDS_ALPHA']);
    }

    public function getPosts(string $orderType, ?string $communityName = null, ?string $username= null) : ?array
    {

        $params = [];

        if ($communityName) {
            $communityName = DataFormatter::string($communityName);
            $sql = "SELECT posts.id, title, content, imagePath, posts.nsfw, COUNT(posts_upvotes.post_id) AS upvotes, COUNT(posts_downvotes.post_id) AS downvotes, posts.created_at, username AS author, avatar, (SELECT COUNT(posts_comments.id) FROM posts_comments WHERE posts_comments.post_id = posts.id) AS comments, communities.name AS community_name, communities.icon AS community_icon, posts.community_id FROM posts INNER JOIN users ON posts.author_id = users.id INNER JOIN users_details ON users.id = users_details.user_id INNER JOIN communities ON posts.community_id = communities.id LEFT JOIN posts_upvotes ON posts.id = posts_upvotes.post_id LEFT JOIN posts_downvotes ON posts.id = posts_downvotes.post_id WHERE communities.name = :communityName";
            $params = [':communityName' => $communityName];
        } else {
            $sql = "SELECT posts.id, title, content, imagePath, posts.nsfw, COUNT(posts_upvotes.post_id) AS upvotes, COUNT(posts_downvotes.post_id) AS downvotes, posts.created_at, username AS author, avatar, (SELECT COUNT(posts_comments.id) FROM posts_comments WHERE posts_comments.post_id = posts.id) AS comments, communities.name AS community_name, communities.icon AS community_icon, posts.community_id FROM posts INNER JOIN users ON posts.author_id = users.id INNER JOIN users_details ON users.id = users_details.user_id INNER JOIN communities ON posts.community_id = communities.id LEFT JOIN posts_upvotes ON posts.id = posts_upvotes.post_id LEFT JOIN posts_downvotes ON posts.id = posts_downvotes.post_id";
        }

        if($username) {
            $username = DataFormatter::string($username);
            if(!$communityName) $sql .= " WHERE username = :username";
            else $sql .= " AND username = :username";
            $params[':username'] = $username;
        }

        try {
            $this->db->prepare($sql ." GROUP BY posts.id ORDER BY $orderType DESC LIMIT 1000;", $params);
            $this->db->execute();
        } catch (Exception $e) {
            $this->error = $e;
            throw new Exception($e->getMessage());
        }
        if ($this->db->numRows() < 1) {
            return null;
        }

        $data = $this->db->fetchAll();

        foreach ($data as &$post) {
            $post['timestamp'] = DataFormatter::timestamp($post['created_at']);
            $post['id'] = $this->sqids->encode([$post['id']]);
        }

        return $data;
    }

    public function getPost(string $postId, ?string $userId = null) : ?array
    {
        $postIdDecoded = implode($this->sqids->decode($postId));

        $data = [
            'post' => null,
            'comments' => null
        ];

        if (!$userId) {
            $sql = "SELECT posts.id, title, content, imagePath, posts.nsfw, posts.created_at, username AS author, posts.author_id, avatar, communities.name AS community_name, communities.id AS community_id, communities.icon AS community_icon, COUNT(posts_upvotes.post_id) AS upvotes, COUNT(posts_downvotes.post_id) AS downvotes FROM posts INNER JOIN users ON posts.author_id = users.id INNER JOIN communities ON posts.community_id = communities.id INNER JOIN users_details ON users.id = users_details.user_id LEFT JOIN posts_upvotes ON posts.id = posts_upvotes.post_id LEFT JOIN posts_downvotes ON posts.id = posts_downvotes.post_id WHERE posts.id = :postId";
        } else {
            $sql = "SELECT posts.id, title, content, imagePath, posts.nsfw, posts.created_at, username AS author, posts.author_id, avatar, communities.name AS community_name, communities.id AS community_id, communities.icon AS community_icon, COUNT(posts_upvotes.post_id) AS upvotes, COUNT(posts_downvotes.post_id) AS downvotes, (SELECT COUNT(*) FROM posts_upvotes WHERE post_id = :postId AND user_id = :userId) AS userUpvote, (SELECT COUNT(*) FROM posts_downvotes WHERE post_id = :postId AND user_id = :userId) As userDownvote FROM posts INNER JOIN users ON posts.author_id = users.id INNER JOIN communities ON posts.community_id = communities.id INNER JOIN users_details ON users.id = users_details.user_id LEFT JOIN posts_upvotes ON posts.id = posts_upvotes.post_id LEFT JOIN posts_downvotes ON posts.id = posts_downvotes.post_id WHERE posts.id = :postId";
        }

        try {
            $this->db->prepare($sql, [':postId' => $postIdDecoded, ':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            $this->error = $e;
            throw new Exception($e->getMessage());
        }
        if ($this->db->numRows() < 1) {
            return null;
        }

        $post = $this->db->fetchAssoc();

        $post['timestamp'] = DataFormatter::timestamp($post['created_at']);

        try {
            $this->db->prepare("SELECT posts_comments.*, username AS author_name, avatar FROM posts_comments INNER JOIN users ON author_id = users.id INNER JOIN users_details ON users.id = users_details.user_id WHERE post_id = :postId ORDER BY posts_comments.created_at DESC", [':postId' => $postIdDecoded]);
            $this->db->execute();
        } catch (Exception $e) {
            $this->error = $e;
            throw new Exception($e->getMessage());
        }

        $comments = $this->db->fetchAll();

        $post['id'] = $postId;
        $data['post'] = $post;
        $data['comments'] = $comments;

        foreach ($data['comments'] as &$comment) {
            $comment['timestamp'] = DataFormatter::timestamp($comment['created_at']);
        }


        return $data;
    }

    public function addPost(string $title, string $content, string $communityId, string|bool $nsfw = false, string|null $imagePath = null, string $userId): bool
    {
        $title = DataFormatter::string($title);
        $content = DataFormatter::string($content);

        if (is_string($nsfw)) {
            if ($nsfw == "true") $nsfw = 1;
            elseif ($nsfw == "false") $nsfw = 0;
        }

        try {
            $this->db->prepare("INSERT INTO posts (title, content, author_id, community_id, nsfw, imagePath) VALUES(:title, :content, :authorId, :communityId, :nsfw, :imagePath)", [':title' => $title, ':content' => $content, ':authorId' => $userId, ':communityId' => $communityId, ':nsfw' => $nsfw, ':imagePath' => $imagePath]);
            $this->db->execute();
        } catch (Exception $e) {
            $this->error = $e;
            throw new Exception($e->getMessage());
        }

        $this->postId = $this->sqids->encode([$this->db->insertId()]);

        return true;
    }
    
    public function deletePost(string $postId, string $userId): bool
    {
        $postIdDecoded = implode($this->sqids->decode($postId));
        try {
            $this->db->prepare("DELETE FROM posts WHERE posts.id = :postId AND author_id = :userId", [':postId' => $postIdDecoded, ':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            $this->error = $e;
            throw new Exception($e->getMessage());
        }

        return true;
    }

    public function upvote(string $postId, string $userId) : bool
    {
        $postId = DataFormatter::string($postId);
        $postIdDecoded = implode($this->sqids->decode($postId));
        try {
            $this->db->prepare("SELECT (SELECT COUNT(*) FROM posts_upvotes AS pu WHERE pu.post_id = :postId AND pu.user_id = :userId) AS upvote, (SELECT COUNT(*) FROM posts_downvotes AS pd WHERE pd.post_id = :postId AND pd.user_id = :userId) AS downvote", [':postId' => $postIdDecoded, ':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            $this->error = $e;
            throw new Exception($e->getMessage());
        }

        $data = $this->db->fetchAssoc();
        if ($data['upvote'] >= 1) {
            try {
                $this->db->prepare("DELETE FROM posts_upvotes WHERE user_id = :userId AND post_id = :postId ", [':postId' => $postIdDecoded, ':userId' => $userId]);
                $this->db->execute();
            } catch (Exception $e) {
                $this->error = $e;
                throw new Exception($e->getMessage());
            }
            return true;
        } else {
            if ($data['downvote'] >= 1) {
                try {
                    $this->db->prepare("DELETE FROM posts_downvotes WHERE user_id = :userId AND post_id = :postId ", [':postId' => $postIdDecoded, ':userId' => $userId]);
                    $this->db->execute();
                } catch (Exception $e) {
                    $this->error = $e;
                    throw new Exception($e->getMessage());
                }
            } 

            try {
                $this->db->prepare("INSERT INTO posts_upvotes VALUES (:postId, :userId)", [':postId' => $postIdDecoded, ':userId' => $userId]);
                $this->db->execute();
            } catch (Exception $e) {
                $this->error = $e;
                throw new Exception($e->getMessage());
            }

            return true;
        }
    }
    
    public function downvote(string $postId, string $userId) : bool
    {
        $postId = DataFormatter::string($postId);
        $postIdDecoded = implode($this->sqids->decode($postId));
        try {
            $this->db->prepare("SELECT (SELECT COUNT(*) FROM posts_upvotes AS pu WHERE pu.post_id = :postId AND pu.user_id = :userId) AS upvote, (SELECT COUNT(*) FROM posts_downvotes AS pd WHERE pd.post_id = :postId AND pd.user_id = :userId) AS downvote", [':postId' => $postIdDecoded, ':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            $this->error = $e;
            throw new Exception($e->getMessage());
        }

        $data = $this->db->fetchAssoc();
        if ($data['downvote'] >= 1) {
            try {
                $this->db->prepare("DELETE FROM posts_downvotes WHERE user_id = :userId AND post_id = :postId ", [':postId' => $postIdDecoded, ':userId' => $userId]);
                $this->db->execute();
            } catch (Exception $e) {
                $this->error = $e;
                throw new Exception($e->getMessage());
            }
            return true;
        } else {
            if ($data['upvote'] >= 1) {
                try {
                    $this->db->prepare("DELETE FROM posts_upvotes WHERE user_id = :userId AND post_id = :postId ", [':postId' => $postIdDecoded, ':userId' => $userId]);
                    $this->db->execute();
                } catch (Exception $e) {
                    $this->error = $e;
                    throw new Exception($e->getMessage());
                }
            } 

            try {
                $this->db->prepare("INSERT INTO posts_downvotes VALUES (:postId, :userId)", [':postId' => $postIdDecoded, ':userId' => $userId]);
                $this->db->execute();
            } catch (Exception $e) {
                $this->error = $e;
                throw new Exception($e->getMessage());
            }

            return true;
        }
    }

    public function search(string $value) 
    {
        $value = DataFormatter::string($value);
        try {
            $this->db->prepare("SELECT posts.id, title, content, imagePath, posts.nsfw, COUNT(posts_upvotes.post_id) AS upvotes, COUNT(posts_downvotes.post_id) AS downvotes, posts.created_at, username AS author, (SELECT COUNT(posts_comments.id) FROM posts_comments WHERE posts_comments.post_id = posts.id) AS comments, communities.name AS community_name FROM posts INNER JOIN users ON posts.author_id = users.id INNER JOIN communities ON posts.community_id = communities.id LEFT JOIN posts_upvotes ON posts.id = posts_upvotes.post_id LEFT JOIN posts_downvotes ON posts.id = posts_downvotes.post_id WHERE posts.title LIKE :search GROUP BY posts.id LIMIT 10;", [':search' => '%'.$value.'%']);
            $this->db->execute();
        } catch (Exception $e) {
            $this->error = $e;
            throw new Exception($e->getMessage());
        }

        $data = $this->db->fetchAll();
        return $data;
    }
}
