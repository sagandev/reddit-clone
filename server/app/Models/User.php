<?php

declare(strict_types=1);

namespace App\Models;

require __DIR__ . '/../../vendor/autoload.php';

use App\Helper\DataFormatter;
use Exception;

class User
{
    public $db;
    public $error = "Internal Server Error";
    public $info;
    public $user = ['email' => "", 'secret_key' => ""];
    public $httpStatus = 200;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function login(string $email, string $password)
    {
        $email = DataFormatter::email($email);
        $password = DataFormatter::string($password);

        try {
            $this->db->prepare("SELECT id, email, password, username, avatar, active FROM users INNER JOIN users_details ON users.id = users_details.user_id WHERE email = :userEmail", [":userEmail" => $email]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        if ($this->db->numRows() == 0) {
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
            $this->db->prepare("SELECT email, username FROM users WHERE email = :userEmail", [':userEmail' => $email, ':username' => $username]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        if ($this->db->numRows() != 0) {
            return false;
        }

        $password = password_hash($password, PASSWORD_DEFAULT);


        try {
            $this->db->prepare("INSERT INTO users (email, username, password) VALUES (:email, :username, :password);", [':email' => $email, ':username' => $username, ':password' => $password]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        $id = $this->db->insertId();

        try {
            $this->db->prepare("INSERT INTO users_stats (user_id) VALUES (:userId);", [':userId' => $id]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        try {
            $this->db->prepare("INSERT INTO users_details (user_id) VALUES (:userId);", [':userId' => $id]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        $key = bin2hex(random_bytes(50));
        try {
            $this->db->prepare("INSERT INTO users_verification (email, verification_key) VALUES (:email, :key);", [':email' => $email, ':key' => $key]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        $this->user['email'] = $email;
        $this->user['secret_key'] = $key;
        return true;
    }

    public function getUserByUsername(string $username): ?array
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
        return $user;
    }
    public function getUserById(string $userId): ?array
    {
        $userId = DataFormatter::string($userId);

        try {
            $this->db->prepare("SELECT u.id, username, followers, karma, avatar, banner, display_name, about FROM users AS u INNER JOIN users_stats AS us ON us.user_id = u.id INNER JOIN users_details AS ud ON ud.user_id = u.id WHERE u.id = :userId", [':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        $user = $this->db->fetchAssoc();

        if (!$user) {
            return null;
        }
        return $user;
    }
    public function getUserPosts(string $userId): ?array
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

    public function getUserCommunities(string $username): ?array
    {
        $username = DataFormatter::string($username);

        try {
            $this->db->prepare("SELECT com.id, com.name, com.icon FROM communities AS com INNER JOIN communities_members AS cm ON cm.community_id = com.id INNER JOIN users ON users.id = cm.user_id WHERE users.username = :username", [':username' => $username]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        $res = $this->db->fetchAll();

        return $res;
    }

    public function updatePassword(string $userId, string $newPassword): bool
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

    public function updateAvatar(string $userId, string $avatarPath): bool
    {
        try {
            $this->db->prepare("UPDATE users_details SET avatar = :avatarPath WHERE user_id = :userId", [':avatarPath' => $avatarPath, ':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            return false;
            throw new Exception($e->getMessage());
        }

        return true;
    }

    public function passwordRecovery(string $userEmail): bool
    {
        $userEmail = DataFormatter::email($userEmail);

        try {
            $this->db->prepare("SELECT email, username FROM users WHERE email = :userEmail", [':userEmail' => $userEmail]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        if ($this->db->numRows() == 0) {
            $this->error = "User with provided email doesn't exist";
            return false;
        }

        try {
            $this->db->prepare("SELECT email FROM users_recovery WHERE email = :userEmail", [':userEmail' => $userEmail]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        if ($this->db->numRows() >= 1) {
            $this->error = "Recovery code has been already sent.";
            return false;
        }

        $recoveryKey = bin2hex(random_bytes(55));

        try {
            $this->db->prepare("INSERT INTO users_recovery(email, recovery_key) VALUES (:email, :recoveryKey)", [':email' => $userEmail, ':recoveryKey' => $recoveryKey]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
        $this->user['email'] = $userEmail;
        $this->user['secret_key'] = $recoveryKey;
        return true;
    }

    public function setPassword(string $userEmail, string $password, string $key): bool
    {
        $userEmail = DataFormatter::email($userEmail);

        try {
            $this->db->prepare("SELECT email, username FROM users WHERE email = :userEmail", [':userEmail' => $userEmail]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        if ($this->db->numRows() == 0) {
            $this->error = "User with provided email doesn't exist";
            $this->httpStatus = 404;
            return false;
        }

        try {
            $this->db->prepare("SELECT email, recovery_key FROM users_recovery WHERE email = :userEmail", [':userEmail' => $userEmail]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        if ($this->db->numRows() == 0) {
            $this->error = "Can't find recovery code.";
            $this->httpStatus = 404;
            return false;
        }

        $data = $this->db->fetchAssoc();

        $compare = hash_equals($data['recovery_key'], $key);

        if (!$compare) {
            $this->error = "Invalid recovery key";
            $this->httpStatus = 403;
            return false;
        }

        $passHash = password_hash($password, PASSWORD_DEFAULT);

        try {
            $this->db->prepare("UPDATE users SET password = :newPassword WHERE email = :userEmail", [':newPassword' => $passHash, ':userEmail' => $userEmail]);
            $this->db->execute();
        } catch (Exception $e) {
            $this->error = "Can't update user's password";
            throw new Exception($e->getMessage());
        }

        try {
            $this->db->prepare("DELETE FROM users_recovery WHERE email = :userEmail", [':userEmail' => $userEmail]);
            $this->db->execute();
        } catch (Exception $e) {
            $this->error = "Can't delete old recovery code";
            throw new Exception($e->getMessage());
        }

        return true;
    }

    public function activate(string $userEmail, string $key): bool
    {
        $userEmail = DataFormatter::email($userEmail);

        try {
            $this->db->prepare("SELECT email, active FROM users WHERE email = :userEmail", [':userEmail' => $userEmail]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        if ($this->db->numRows() == 0) {
            $this->error = "Can't find user.";
            $this->httpStatus = 404;
            return false;
        }

        $user = $this->db->fetchAssoc();
        try {
            $this->db->prepare("SELECT email, verification_key FROM users_verification WHERE email = :userEmail", [':userEmail' => $user['email']]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        if ($user['active'] && $this->db->numRows() == 0) {
            $this->error = "Your account has been already activated";
            $this->httpStatus = 403;
            return false;
        }

        $userActivation = $this->db->fetchAssoc();
        $compare = hash_equals($userActivation['verification_key'], $key);

        if (!$compare) {
            $this->error = "Activation key is incorrect";
            $this->httpStatus = 403;
            return false;
        }

        try {
            $this->db->prepare("UPDATE users SET active = 1 WHERE email = :userEmail;", [':userEmail' => $user['email']]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        try {
            $this->db->prepare("DELETE FROM users_verification WHERE email = :userEmail",[':userEmail' => $user['email']]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        return true;
    }
}
