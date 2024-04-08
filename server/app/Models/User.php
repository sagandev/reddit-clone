<?php

namespace App\Models;

require __DIR__ . '/../../vendor/autoload.php';
use App\Helper\DataFormatter;
use Exception;

class User
{
    public $db;
    public $error;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function login(string $email, string $password)
    {
        $email = DataFormatter::email($email);
        $password = DataFormatter::string($password);

        try {
            $this->db->prepare("SELECT id, email, password, username FROM users WHERE email = :userEmail", [":userEmail" => $email]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        if ($this->db->numRows() != 1) {
            return false;
        }

        $res = $this->db->fetchAssoc();
        $verPass = password_verify($password, $res["password"]);

        if (!$verPass) {
            return false;
        }

        unset($res["password"]);
        return $res;
    }

    public function register(string $email, string $password, string $username): bool
    {
        $email = DataFormatter::email($email);
        $password = DataFormatter::string($password);
        $username = DataFormatter::string($username);

        try {
            $this->db->prepare("SELECT email, username FROM users WHERE email = :userEmail AND username = :username", [':userEmail' => $email, ':username' => $username]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        if ($this->db->numRows() === 1) {
            return false;
        }

        $password = password_hash($password, PASSWORD_DEFAULT);

        try {
            $this->db->prepare("INSERT INTO users (email, username, password) VALUES ('{$email}', '{$username}', '{$password}');");
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        return true;
    }

    public function getUser(string $username)
    {
        $username = DataFormatter::string($username);

        try {
            $this->db->prepare("SELECT u.id, username, followers, karma, avatar, banner, display_name, about FROM users AS u INNER JOIN users_stats AS us ON us.user_id = u.id INNER JOIN users_details AS ud ON ud.user_id = u.id WHERE username = :username", [':username' => $username]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        $user = $this->db->fetchAssoc();

        if (!$user) {
            return null;
        }

        $posts = $this->getUserPosts($user['id']);

        unset($user['id']);

        return [
            'user' => $user,
            'posts' => $posts
        ];
    }

    public function getUserPosts(string $userId)
    {
        $userId = DataFormatter::string($userId);

        try {
            $this->db->prepare("SELECT p.title, p.content, p.community_id, p.nsfw, p.upvotes, p.downvotes, p.created_at, c.name AS community_name FROM posts AS p INNER JOIN communities AS c ON p.community_id = c.id WHERE author_id = :userId", [':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        $res = $this->db->fetchAll();

        return $res;
    }
    
    public function getUserCommunities(string $username)
    {
        $username = DataFormatter::string($username);

        try {
            $this->db->prepare("SELECT com.id, com.name FROM communities AS com INNER JOIN communities_members AS cm ON cm.community_id = com.id INNER JOIN users ON users.id = cm.user_id WHERE users.username = :username", [':username' => $username]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        $res = $this->db->fetchAll();

        return $res;
    }

    public function updatePassword(string $userId, string $newPassword) : bool
    {
        $newPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        try {
            $this->db->prepare("UPDATE users SET password = :password WHERE user_id = :userId", [':password' => $newPassword, ':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            return false;
            throw new Exception($e->getMessage());
        }

        

        return true;
    }
}
