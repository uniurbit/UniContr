<?php

namespace App\Service;
use Request;
use App\LogActivity as LogActivityModel;
use App\User;
use Auth;
use Illuminate\Support\Str;

class LogActivityService
{


    public static function addToLog($subject, $content = null)
    {

        if ($content == null){
            $content = Request::getContent();
            $content = (strlen($content) > 500) ? Str::limit($content,500) : $content;
        }

    	$log = [];
    	$log['subject'] = $subject;
    	$log['url'] = Request::fullUrl();
    	$log['method'] = Request::method();
    	$log['ip'] = Request::ip();
        $log['agent'] = Request::header('user-agent');
        $log['request'] = $content;
    	$log['user_id'] = Auth::user() ? Auth::user()->id : -1;
    	LogActivityModel::create($log);
    }


    public static function logActivityLists()
    {
    	return LogActivityModel::latest()->get();
    }


}