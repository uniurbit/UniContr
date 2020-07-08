<?php

return [
    'oracle' => [
        'driver'         => 'oracle',
        'tns'            => env('DB_TNS', ''),
        
        // env('DB_TNS', ''),
        // 'host'           => env('DB_HOST', ''),
        // 'port'           => env('DB_PORT', '1521'),        
        'database'       => env('DB_DATABASE', 'xe'),
        'service_name'   =>  env('DB_SERVICENAME', ''),
        'username'       => env('DB_USERNAME_ORACLE', ''),
        'password'       => env('DB_PASSWORD_ORACLE', ''),
        // 'charset'        => env('DB_CHARSET', 'AL32UTF8'),
        'prefix'         => env('DB_PREFIX', ''),
        // 'prefix_schema'  => env('DB_SCHEMA_PREFIX', ''),
        // 'server_version' => env('DB_SERVER_VERSION', '11g'),
    ],
];
