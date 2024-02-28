<?php

declare(strict_types=1);

namespace App\Models;

require __DIR__ . '/../../vendor/autoload.php';
use App\Helper\DataFormatter;
use Exception;

class Community
{
    public $db;

    public function __construct()
    {
        $this->db = new Database();
    }

    public function getCommunities(string $search)
    {

        $search = DataFormatter::string($search);

        try {
            $this->db->prepare("SELECT communities.name, communities.id, (SELECT COUNT(*) FROM communities_members WHERE community_id = communities.id) AS members FROM communities WHERE community_name LIKE '%:search%'", [':search' => $search]);
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

    public function getCommunity(string $communityId) 
    {

        try {
            $this->db->prepare("SELECT communities.*, (SELECT COUNT(*) FROM communities_members WHERE community_id = communities.id) AS members_count, users.name AS owner_name FROM communities INNER JOIN users ON communities.owner = users.id WHERE id = :communityId", [':communityId' => $communityId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
        if ($this->db->numRows() < 1) {
            return null;
        }

        $community = $this->db->fetchAssoc();

        try {
            $this->db->prepare("SELECT users.id, users.name FROM communitites_members INNER JOIN users ON user_id = users.id WHERE community_id = :communityId AND role = 'mod'", [':communityId' => $communityId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        $moderators = $this->db->fetchAll();

        $data = [
            'community' => $commmunity,
            'moderators' => $moderators,
        ];

        return $data;
    }
    public function getTopCommunities() 
    {
        try {
            $this->db->prepare("SELECT name, (SELECT COUNT(*) FROM communities_members WHERE community_id = communities.id) AS members FROM communities ORDER BY members DESC LIMIT 5");
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
    public function createCommunity(string $name, string $desc, string $userId, bool $nsfw = false): bool
    {
        $title = DataFormatter::string($title);
        $content = DataFormatter::string($content);

        if(!is_bool($nsfw) || !is_numeric($userId)) exit;

        try {
            $this->db->prepare("INSERT INTO communities (name, description, owner, nsfw) VALUES(:name, :description, :owner, :nsfw)", [':name' => $name, ':description' => $desc, ':owner' => $userId, ':nsfw' => $nsfw]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        return true;
    }
    public function deleteCommunity(string $communityId, string $userId): bool
    {
        try {
            $this->db->prepare("DELETE FROM communities WHERE id = :communityId AND author_id = :authorId", [':communityId' => $communityId, ':authorId' => $authorId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }

        return true;
    }
}
