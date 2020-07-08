<?php
/**
 * uniurb/unidem package configuration file. 
 */
return [

    /**
     * Configurazione data e ora:
     */
    'date_format'        => 'd-m-Y',
    'time_format'        => 'H:i:s',
    'datetime_format' => 'd-m-Y H:i:s',
    'timezone' => 'Europe/Rome',

    'date_format_contratto' => 'd/m/Y',


    'route'              => '',  
    /**
     * URL target per l'applicazione client
     */
    'client_url' => env('CLIENT_URL', 'http://localhost:4200/'),   

    //Configurazioni per dati di seed

    /**
     * Codici unità organizzativa associati al ruolo super-admin 
     * esempio: '005400'
     */
    'unitaSuperAdmin' => [''],
    /**
     * Codici unità organizzativa associati al ruolo admin 
     */
    'unitaAdmin' => explode(',',env('UFF_ADMIN','')),    
    /**
     * Codici unità organizzativa associati al ruolo op_approvazione
     * esempio '005144,005343' 
     */
    'ufficiPerValidazione' =>  explode(',',env('UFF_VALIDAZIONE', '')),    

    //configurazione email
    
    /**
     * Lista email separate da , per amministratori di sistema
     */
    'administrator_email' =>  explode(',',env('ADMINISTRATOR_EMAIL', 'admin@uniurb.it')),   

    /**
     * Lista email separate da , per spedizione report alle segreterie
     */
    'cc_report_segreterie' =>  explode(',',env('CC_REPORT_SEGRETERIE', 'segreteria@uniurb.it,segreteria1@uniurb.it')),   
   
    /**
     * Lista email separate da , per notifica di visione accettazione da parte del docente  
     */
    'firma_direttore_email' => explode(',',env('FIRMA_DIRETTORE_EMAIL',  'firma@uniurb.it')),    

     /**
     * Lista email separate da , per notifica compilazione terminata da parte del docente  
     */       
    'cmu_email' => explode(',',env('CMU_EMAIL',  'amministrazione@uniurb.it')),           
];