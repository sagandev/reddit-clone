<?php
require_once dirname(realpath(__FILE__)) . "/../libs/Session.php";
require_once dirname(realpath(__FILE__)) . "/../classes/TasksData.php";
require_once dirname(realpath(__FILE__)) . "/../helpers/DataFormatter.php";
$task = new TasksData();
Session::init();
if($_SERVER["REQUEST_METHOD"] == "POST") {
    if(!Session::authorized()) {
        http_response_code(401);
        die(json_encode(array("status" => "Error", "message" => "Unauthorized")));
    }
    if(empty($_POST["taskId"]) || empty($_POST["list"])) {
        http_response_code(400);
        die(json_encode(array("status" => "Error", "message" => "Not all data provided")));
    }

    $taskContent = DataFormatter::string($_POST["taskId"]);
    $list = DataFormatter::string($_POST["list"]);
    if ($list != "today" && $list != "tommorow" && $list != "week"){
        http_response_code(403);
        die(json_encode(array("status" => "Error", "message" => "Bad request")));
    }
    $user = Session::get("user");
    try {
        $newTask = $task->deleteTask($list, $taskId, $user["user_id"]);
    } catch(Exception $e) {
        http_response_code(500);
        die (json_encode(array("status" => "Error", "message" => $e->getMessage())));
    }

    http_response_code(200);
    echo json_encode(array("status" => "Success", "message" => "Task has been deleted successfully"));
}