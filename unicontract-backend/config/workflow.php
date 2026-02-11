<?php

 // Transitions are defined with a unique name, an origin place and a destination place
 //https://github.com/brexis/laravel-workflow


//php artisan workflow:dump validazione --class App\Scadenza
return [
    //workflow relativo ai task per gli utenti
    'validazione'   => [
        'type'          => 'state_machine', 
        'audit_trail'   => [
            'enabled' => true
        ],
        'marking_store' => [
            'type' => 'single_state', //multiple_state single_state
            'property' => 'current_place',            
        ],
        'supports'      => ['App\Models\Validazioni'],
        'places'        => ['completata','validata_economica', 'validata_amministrativa', 'revisione_economica','revisione_amministrativa',
                            'revisione_amministrativaeconomica','revisione_amministrativaeconomica_economica'],
        'transitions'   => [    
            //flag_upd == amministraviva; flag_amm == economica
            //validaizone amministrativa
            'valida_amministrativa' => [
                'from' => 'completata', 
                'to'   => 'validata_amministrativa',
            ],                  
            //validazione economica                            
            'valida_economica' => [
                'from' => 'validata_amministrativa',
                'to'   => 'validata_economica',
            ],               
            'annulla_amministrativa' => [
                'from' => 'validata_amministrativa', 
                'to'   => 'revisione_amministrativa',
            ],   
            'annulla_economica' => [
                'from' => 'validata_economica', 
                'to'   => 'revisione_economica',
            ],   
            'annulla_amministrativarevisioneeconomica' => [
                'from' => 'revisione_economica', 
                'to' => 'revisione_amministrativaeconomica'
            ],
            'annulla_amministrativaeconomica' => [
                'from' => 'validata_economica', 
                'to'   => 'revisione_amministrativaeconomica',
            ],               
            'annulla_revisioneamministrativaeconomica' => [
                'from' => 'revisione_amministrativaeconomica_economica',
                'to' => 'revisione_amministrativaeconomica'
            ],            
            'valida_revisione_amministrativaeconomica_amministrativa' => [
                'from' => 'revisione_amministrativaeconomica', 
                'to'   => 'revisione_amministrativaeconomica_economica',
            ],
            'valida_revisione_amministrativaeconomica_economica' => [
                'from' => 'revisione_amministrativaeconomica_economica', 
                'to'   => 'validata_economica',
            ],                         
            'valida_revisione_amministrativa' => [
                'from' => 'revisione_amministrativa', 
                'to'   => 'validata_amministrativa',
            ],   
            'valida_revisione_economica' => [
                'from' => 'revisione_economica', 
                'to'   => 'validata_economica',
            ],                           
        ],
    ],

];

// $model->workflow_apply($transition, $model->getWorkflowName());

// Apply a transition
//$workflow->apply($post, 'to_review');
//$post->save(); // Don't forget to persist the state