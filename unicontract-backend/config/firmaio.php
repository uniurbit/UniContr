<?php

return [

    'subscription_key'=> env('FIRMAIO_SUBSCRIPTION_KEY',''),     
    'url' => env('FIRMAIO_URL','https://api.io.pagopa.it/api/v1/sign'), 

    'dossier_id' => env('FIRMAIO_DOSSIER_ID'),

    'giorni_scadenza' => env('FIRMAIO_GIORNI_SCADENZA',15)
];