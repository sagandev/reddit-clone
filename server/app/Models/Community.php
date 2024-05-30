<?php

declare(strict_types=1);

namespace App\Models;

require __DIR__ . '/../../vendor/autoload.php';

use App\Helper\DataFormatter;
use Exception;

class Community
{
    public $db;
    public $error;
    public $httpStatus = 200;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function getCommunities(string $search)
    {

        $search = DataFormatter::string($search);

        try {
            $this->db->prepare("SELECT communities.name, communities.id, communities.icon, (SELECT COUNT(*) FROM communities_members WHERE community_id = communities.id) AS members FROM communities WHERE communities.name LIKE :search", [':search' => '%' . $search . '%']);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
        if ($this->db->numRows() < 1) {
            return null;
        }

        $data = $this->db->fetchAll();

        return $data;
    }

    public function getCommunity(string $communityName): ?array
    {

        try {
            $this->db->prepare("SELECT communities.*, (SELECT COUNT(*) FROM communities_members WHERE community_id = communities.id) AS members_count, users.username AS owner_name FROM communities INNER JOIN users ON communities.owner = users.id WHERE communities.name = :communityName", [':communityName' => $communityName]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
        if ($this->db->numRows() < 1) {
            return null;
        }

        $community = $this->db->fetchAssoc();
        $communityId = $community['id'];
        try {
            $this->db->prepare("SELECT users.id, users.username FROM communities_members INNER JOIN users ON user_id = users.id WHERE community_id = :communityId AND role = 'mod'", [':communityId' => $communityId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        $moderators = $this->db->fetchAll();

        $data = [
            'community' => $community,
            'moderators' => $moderators,
        ];

        return $data;
    }

    public function getTopCommunities(): ?array
    {
        try {
            $this->db->prepare("SELECT name, icon, (SELECT COUNT(*) FROM communities_members WHERE community_id = communities.id) AS members FROM communities ORDER BY members DESC LIMIT 5");
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
        if ($this->db->numRows() < 1) {
            return null;
        }

        $data = $this->db->fetchAll();

        foreach ($data as &$community) {
            $community['members'] = number_format($community['members']);
        }

        return $data;
    }

    public function createCommunity(string $name, string $desc, bool $nsfw = false, string|null $icon = null, string $userId): bool
    {
        $name = DataFormatter::string($name);
        $desc = DataFormatter::string($desc);

        if (!is_bool($nsfw) || !is_numeric($userId)) {
            exit;
        }

        try {
            $this->db->prepare("INSERT INTO communities (name, description, owner, nsfw, icon) VALUES(:name, :description, :owner, :nsfw, :icon)", [':name' => $name, ':description' => $desc, ':owner' => $userId, ':nsfw' => $nsfw, ':icon' => $icon]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        $communityId = $this->db->insertId();

        try {
            $this->db->prepare("INSERT INTO communities_members (community_id, user_id, role) VALUES(:communityId, :userId, :role)", [':communityId' => $communityId, ':userId' => $userId, ':role' => "owner"]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        return true;
    }

    public function deleteCommunity(string $communityId, string $userId): bool
    {
        try {
            $this->db->prepare("DELETE FROM communities WHERE id = :communityId AND author_id = :authorId", [':communityId' => $communityId, ':authorId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        return true;
    }

    public function join(string $communityId, string $userId): bool
    {
        try {
            $this->db->prepare("SELECT user_id FROM communities_members WHERE community_id = :communityId AND user_id = :userId", [':communityId' => $communityId, ':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        if ($this->db->numRows() == 1) {
            $this->error = "You already joined this community";
            $this->httpStatus = 400;
            return false;
        }

        try {
            $this->db->prepare("INSERT INTO communities_members (community_id, user_id) VALUES(:communityId, :userId)", [':communityId' => $communityId, ':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            $this->error = "Unable to join to community";
            $this->httpStatus = 500;
            throw new Exception($e->getMessage());
        }

        return true;
    }

    public function edit(string $name, string $description, string|bool $nsfw, string $userId, string $communityId)
    {
        try {
            $this->db->prepare("SELECT communities.* FROM communities WHERE communities.id = :communityId AND owner = :userId", [':communityId' => $communityId, ':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        if ($this->db->numRows() == 0) {
            $this->httpStatus = 404;
            $this->error = "Community not found";
            return false;
        }

        $community = $this->db->fetchAssoc();

        if ($community['name'] != $name) {
            try {
                $this->db->prepare("SELECT communities.name FROM communities WHERE communities.name = :communityName", [':communityName' => $name]);
                $this->db->execute();
            } catch (Exception $e) {
                throw new Exception($e->getMessage());
            }

            if ($this->db->numRows() != 0) {
                $this->httpStatus = 400;
                $this->error = "Community with this name already exists";
                return false;
            }
        }


        try {
            $this->db->prepare("UPDATE communities SET name = :name, description = :description, nsfw = :nsfw WHERE communities.id = :communityId AND owner = :userId", [':name' => $name, ':description' => $description, ':nsfw' => $nsfw, ':communityId' => $communityId, ':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        return true;
    }

    public function editIcon(string $iconName, string $userId, string $communityId)
    {
        try {
            $this->db->prepare("SELECT communities.name FROM communities WHERE communities.id = :communityId AND owner = :userId", [':communityId' => $communityId, ':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        if ($this->db->numRows() == 0) {
            $this->httpStatus = 404;
            $this->error = "Community not found";
            return false;
        }

        try {
            $this->db->prepare("UPDATE communities SET icon = :iconName WHERE communities.id = :communityId AND owner = :userId", [':iconName' => $iconName, ':communityId' => $communityId, ':userId' => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        return true;
    }
}
