<?php
require_once dirname(realpath(__FILE__)) . "/../libs/Session.php";
require_once dirname(realpath(__FILE__)) . "/../classes/TasksData.php";
require_once dirname(realpath(__FILE__)) . "/../helpers/DataFormatter.php";
$tasks = new TasksData();
Session::init();

if($_SERVER["REQUEST_METHOD"] == "GET") {
    if(!Session::authorized()) {
        http_response_code(401);
        die(json_encode(array("status" => "Error", "message" => "Unauthorized")));
    }
    $user = Session::get("user");
    $userId = htmlspecialchars($user["user_id"]);
    try {
        $data = $tasks->getTasks($userId);
    } catch(Exception $e) {
        http_response_code(500);
        die(json_encode(array("status" => "Error", "message" => "Internal Server Error")));
    } 

    http_response_code(200);
    echo json_encode($data);
}
unset($tasks);

