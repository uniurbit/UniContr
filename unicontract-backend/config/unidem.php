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
     * Lista email separate da , per spedizione report alle segreterie marco.bernardo@uniurb.it
     */
    'cc_report_segreterie' =>  explode(',',env('CC_REPORT_SEGRETERIE', 'gianluca.antonelli@uniurb.it,anna.galiotta@uniurb.it,pierangela.donnanno@uniurb.it')),   
   
    'dispea_report_segreterie' =>  array_map('trim',explode(',',env('DISPEA_REPORT_SEGRETERIE', 'direttore.dispea@uniurb.it,segreteria.dispea@uniurb.it,scuola.restauro@uniurb.it,scuola.geologia@uniurb.it,scuola.informatica@uniurb.it,scuola.filosofia@uniurb.it'))),   
    'disb_report_segreterie' =>  array_map('trim',explode(',',env('DISB_REPORT_SEGRETERIE', 'direttore.disb@uniurb.it, segreteria.disb@uniurb.it, scuola.farmacia@uniurb.it, scuola.sbb@uniurb.it, scuola.motorie@uniurb.it'))),   
    'digiur_report_segreterie' =>  array_map('trim',explode(',',env('DIGIUR_REPORT_SEGRETERIE', 'direttore.digiur@uniurb.it, segreteria.digiur@uniurb.it, scuola.giurisprudenza@uniurb.it'))),   
    'discui_report_segreterie' =>  array_map('trim',explode(',',env('DISCUI_REPORT_SEGRETERIE', 'direttore.discui@uniurb.it, segreteria.discui@uniurb.it, scuola.lingue@uniurb.it, scuola.comunicazione@uniurb.it'))),   
    'desp_report_segreterie' =>  array_map('trim',explode(',',env('DESP_REPORT_SEGRETERIE', 'direttore.desp@uniurb.it, segreteria.desp@uniurb.it, scuola.economia@uniurb.it, scuola.scienzepolitichesociali@uniurb.it'))),   
    'distum_report_segreterie' =>  array_map('trim',explode(',',env('DISTUM_REPORT_SEGRETERIE', 'direttore.distum@uniurb.it, segreteria.distum@uniurb.it, scuola.lettere@uniurb.it, scuola.formazione@uniurb.it, scuola.arte@uniurb.it'))),   

    /**
     * Lista email separate da , per notifica di visione accettazione da parte del docente  
     */
    'firma_direttore_email' => explode(',',env('FIRMA_DIRETTORE_EMAIL',  'firma@uniurb.it')),    

     /**
     * Lista email separate da , per notifica compilazione terminata da parte del docente  
     */       
    'cmu_email' => explode(',',env('CMU_EMAIL',  'amministrazione@uniurb.it')),           
];