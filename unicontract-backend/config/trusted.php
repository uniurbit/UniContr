<?php
// config/trusted.php

return [
    'domains' => [
        'unidem.uniurb.it',
        'unidem-preprod.uniurb.it',        
    ],

    'ips' => [
        '127.0.0.1', // Localhost IP       
        '192.168.5.137'
    ],

    'api_key' => env('API_KEY'), // Reference the API key from the .env file
];
