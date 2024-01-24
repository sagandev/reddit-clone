<?php
declare(strict_types=1);
require_once dirname(realpath(__FILE__)) . "/../libs/Database.php";
require_once dirname(realpath(__FILE__)) . "/../libs/Session.php";
require_once dirname(realpath(__FILE__)) . "/../helpers/DataFormatter.php";

class TasksData 
{
    public $df;
    public $db;

    public function __construct() {
        $this->df = new DataFormatter();
        $this->db = new Database();
    }

    public function getTasks($userId) {
        try {
            $this->db->prepare("SELECT *, 'today_tasks_list' AS list_name FROM today_tasks_list WHERE user_id = :userId UNION ALL SELECT *, 'tommorow_tasks_list' AS list_name FROM tommorow_tasks_list WHERE user_id = :userId", [":userId" => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
            exit();
        }
        if($this->db->numRows() < 1){
            return null;
        }

        $data = $this->db->fetchAll();
        return json_encode($data);
    }
    public function addTask(string $list, string $taskContent, string $userId) : bool {
        try {
            $this->db->prepare("INSERT INTO :list (user_id, task_content) VALUES (:userId, :taskContent)", [":list" => $list."_tasks_list", ":taskContent" => $taskContent, ":userId" => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
            exit();
        }

        return true;
    }
    public function deleteTask(string $list, string $taskId, string $userId) : bool {
        try {
            $this->db->prepare("DELETE FROM :list WHERE task_id = :taskId AND user_id = :userId", [":list" => $list."_tasks_list", ":taskId" => $taskId, ":userId" => $userId]);
            $this->db->execute();
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
            exit();
        }

        return true;
    }
}