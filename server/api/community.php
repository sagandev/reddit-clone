<?php

require __DIR__ . '/../vendor/autoload.php';
use App\Controllers\CommunityController;

$community = new CommunityController();

$community->handle();