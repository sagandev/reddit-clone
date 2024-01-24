<?php
interface DatabaseInterface
{
    public function prepare(string $query, array $params);
    public function execute();
    public function fetchAssoc();
    public function fetchAll();
    public function numRows();
}