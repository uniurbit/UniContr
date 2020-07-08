<?php

namespace App\Http\Controllers;

// Declare the interface 'iSearch'
interface iSearch
{
    public function search($query, $orderby, $fields, $titlePageSize, $sessionId);
    public function nextTitlePage($sessionId);  
    public function titlePage($sessionId, $pageIndex);  
    public function getSessionId();
}
