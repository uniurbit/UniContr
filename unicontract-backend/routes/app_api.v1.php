<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

//auth:api https://github.com/tymondesigns/jwt-auth/blob/develop/docs/quick-start.md

//aggiornare la documentazione
//php artisan api:update


Route::group(['middleware' => ['cors','auth:api','log','role:super-admin','check'],  'namespace'=>'Api\V1'], function () {

    Route::get('mappingruoli', 'MappingRuoloController@index');
    Route::get('mappingruoli/{id}', 'MappingRuoloController@show');
    Route::post('mappingruoli/query', 'MappingRuoloController@query'); 
    Route::post('mappingruoli', 'MappingRuoloController@store');
    Route::put('mappingruoli/{id}', 'MappingRuoloController@update');
    Route::delete('mappingruoli/{id}', 'MappingRuoloController@delete');

    // USERS
    Route::get('users/roles','UserController@roles');
    Route::get('users/permissions','UserController@permissions');
    Route::resource('users', 'UserController');
    Route::post('users/query', 'UserController@query'); 

    // ROLES
    Route::get('roles', 'RoleController@index');
    Route::get('roles/{id}', 'RoleController@show');
    Route::post('roles/query', 'RoleController@query'); 
    Route::post('roles', 'RoleController@store');
    Route::put('roles/{id}', 'RoleController@update');
    Route::delete('roles/{id}', 'RoleController@delete');

    // PERMISSIONS
    Route::get('permissions', 'PermissionController@index');
    Route::get('permissions/{id}', 'PermissionController@show');
    Route::post('permissions/query', 'PermissionController@query'); 
    Route::post('permissions', 'PermissionController@store');
    Route::put('permissions/{id}', 'PermissionController@update');
    Route::delete('permissions/{id}', 'PermissionController@delete');
    
    
});

Route::group(['middleware' => ['cors','auth:api','log'], 'namespace'=>'Api\V1'], function() {
 
    //mail
    Route::post('mail/sendMail', 'NotificationController@sendMail'); 

    //logattivita
    Route::post('logattivita/query','LogActivityController@query');

    // DOCENTE
    Route::post('docente', 'DocenteController@store');
    Route::get('docente/{v_ie_ru_personale_id_ab}', 'DocenteController@show');
    Route::post('ruolodocente', 'RoleDocenteController@store');

    // INSEGNAMENTO UGOV
    //Route::resource('copertura/{aa_off_id}', 'InsegnamUgovController', ['parameters' => ['{aa_off_id}' => 'anno']]);
    Route::get('copertura/anno/{anno}', 'InsegnamUgovController@index');
    Route::get('copertura/{coper_id}', 'InsegnamUgovController@show');
    Route::get('copertura/{coper_id}/contatore/{cf}', 'InsegnamUgovController@contatoreInsegnamenti');
    Route::post('copertura/query','InsegnamUgovController@query');
    Route::get('copertura/reload/{coper_id}', 'InsegnamentiController@refreshUgovData');

    //CONTR UGOV
    Route::post('contrugov/query','ContrUgovController@query');    
    Route::post('contrugov/export','ContrUgovController@export');   
    Route::post('contrugov/exportxls','ContrUgovController@exportxls');  

    // P.1 INSEGNAMENTO    
    Route::get('insegnamenti/{id}', 'InsegnamentiController@show');
    Route::post('insegnamenti', 'InsegnamentiController@store');
    Route::put('insegnamenti/{id}', 'InsegnamentiController@update');
   // Route::put('insegnamenti/upd/{id}', 'InsegnamentiController@updateP1');
    Route::get('docente/{id}', 'InsegnamentiController@getName');
    Route::post('insegnamenti/query','InsegnamentiController@query');
    Route::get('insegnamenti/sendfirstemail/{id}','InsegnamentiController@sendFirstEmail');
  

    // PRECONTRATTUALE
    Route::resource('precontrattuale', 'PrecontrattualeController');
    Route::post('precontrattuale', 'PrecontrattualeController@store');  
    Route::put('precontrattuale/{insegn_id}', 'PrecontrattualeController@update');
    Route::post('precontrattuale/query','PrecontrattualeController@query');
    Route::post('precontrattuale/newprecontrimportinsegnamento','PrecontrattualeController@newPrecontrImportInsegnamento');
    Route::post('precontrattuale/newincompat','PrecontrattualeController@newIncompat');    
    Route::post('precontrattuale/newprivacy','PrecontrattualeController@newPrivacy');        
    Route::post('precontrattuale/newinps','PrecontrattualeController@newInps');        
    Route::post('precontrattuale/newprestazprofess','PrecontrattualeController@newPrestazioneProfessionale');            
    Route::post('precontrattuale/terminainoltra','PrecontrattualeController@terminaInoltra');
    Route::get('precontrattuale/previewcontratto/{insegn_id}','PrecontrattualeController@previewcontratto');
    Route::get('precontrattuale/modulisticaprecontr/{insegn_id}','PrecontrattualeController@modulisticaPrecontr');
    Route::post('precontrattuale/validazioneamm','PrecontrattualeController@validazioneAmm');  
    Route::post('precontrattuale/validazioneeconomica','PrecontrattualeController@validazioneEconomica');    
    Route::post('precontrattuale/annullaamm','PrecontrattualeController@annullaAmm');    
    Route::post('precontrattuale/annullaeconomica','PrecontrattualeController@annullaEconomica');    
    Route::post('precontrattuale/presavisioneaccettazione','PrecontrattualeController@presaVisioneAccettazione');    
    Route::get('precontrattuale/gettitulusdocumenturl/{id}','PrecontrattualeController@getTitulusDocumentURL');  
    Route::post('precontrattuale/annullacontratto','PrecontrattualeController@annullaContratto');    
    Route::post('precontrattuale/rinunciacompenso','PrecontrattualeController@rinunciaCompenso');   
    Route::post('precontrattuale/annullarinuncia','PrecontrattualeController@annullaRinuncia');  
    Route::post('precontrattuale/export','PrecontrattualeController@export'); 
    Route::post('precontrattuale/exportxls','PrecontrattualeController@exportxls'); 
    Route::post('precontrattuale/updateinsegnamentofromugov', 'PrecontrattualeController@updateInsegnamentoFromUgov'); 
    
    // QUADRO RIEPILOGATIVO
    Route::get('summary/{id}', 'QuadroRiepilogativoController@index');
    Route::post('summary/sendinfoemail','QuadroRiepilogativoController@sendInfoEmail');
    Route::get('summary/iddg/{coper_id}', 'QuadroRiepilogativoController@getIddg');

    // P.2 RAPPORTO
    Route::resource('rapporto', 'P2RapportoController');
    Route::post('rapporto', 'P2RapportoController@store');  
    Route::get('rapporto/{id}', 'P2RapportoController@show');
    Route::put('rapporto/{id}', 'P2RapportoController@update');

    // A.1 ANAGRAFICA
    Route::get('anagrafica/{id_ab}', 'AnagraficaController@show');
    Route::get('anagrafica/local/{id_ab}', 'AnagraficaController@showlocal');
    Route::post('anagrafica', 'AnagraficaController@store');
    Route::put('anagrafica/{id}', 'AnagraficaController@update');

    // A.2 MODALITA DI PAGAMENTO
    Route::get('pagamento/{id_ab}', 'A2ModalitaPagamentoController@show');
    Route::post('pagamento', 'A2ModalitaPagamentoController@store');
    Route::get('pagamento/local/{id}', 'A2ModalitaPagamentoController@showlocal');
    Route::put('pagamento/local/{id}', 'A2ModalitaPagamentoController@update');

    // B.1 CONFLITTO INTERESSI    
    Route::get('conflitto/generatepdf/{id}/{kind}','B1ConflittoIntController@generatePDF');
    Route::get('conflitto/{id}', 'B1ConflittoIntController@index');
    Route::post('conflitto', 'B1ConflittoIntController@store');
    Route::get('conflitto/details/{id}', 'B1ConflittoIntController@show');
    Route::put('conflitto/{id}', 'B1ConflittoIntController@update'); 

    // B.2 INCOMPATIBILITA'
    Route::get('incompat/{id}', 'B2IncompatibilitaController@index');
    Route::post('incompat', 'B2IncompatibilitaController@store');
    Route::get('incompat/details/{id}', 'B2IncompatibilitaController@show');
    Route::put('incompat/{id}', 'B2IncompatibilitaController@update');

    // B.3 RAPPORTO DI STUDIO O LAVORO CON UNIVERSITA'
    Route::get('studio/{id}', 'B3RappStudioUniversController@index');
    Route::post('studio', 'B3RappStudioUniversController@store');
    Route::get('studio/details/{id}', 'B3RappStudioUniversController@show');
    Route::put('studio/{id}', 'B3RappStudioUniversController@update');
    
    // B.4 RAPPORTO CON LA PUBBLICA AMMINISTRAZIONE
    Route::get('rapppa/{id}', 'B4RapportoPAController@index');
    Route::post('rapppa', 'B4RapportoPAController@store');
    Route::get('rapppa/details/{id}', 'B4RapportoPAController@show');
    Route::put('rapppa/{id}', 'B4RapportoPAController@update');

    // B.5 STATO DI PENSIONAMENTO
    Route::get('pension/{id}', 'B5StatoPensionamentoController@index');
    Route::get('pension/details/{id}', 'B5StatoPensionamentoController@show');
    Route::post('pension', 'B5StatoPensionamentoController@store');
    Route::put('pension/{id}', 'B5StatoPensionamentoController@update');

    // B.6 INFORMATIVA SULLA PRIVACY
    Route::get('privacy/{id}', 'B6InformativaController@index');
    Route::post('privacy', 'B6InformativaController@store');
    Route::get('privacy/details/{id}', 'B6InformativaController@show');
    Route::put('privacy/{id}', 'B6InformativaController@update');

    // C PRESTAZIONE PROFESSIONALE
    Route::get('cpiva/{id}', 'C_PrestazProfesController@index');
    Route::post('cpiva', 'C_PrestazProfesController@store');
    Route::get('cpiva/details/{id}', 'C_PrestazProfesController@show');
    Route::put('cpiva/{id}', 'C_PrestazProfesController@update');

    // D.1 DATI INPS
    Route::get('inps/{id}', 'D1_InpsController@index');
    Route::post('inps', 'D1_InpsController@store');
    Route::get('inps/details/{id}', 'D1_InpsController@show');
    Route::put('inps/{id}', 'D1_InpsController@update');

    // D.2 DATI INAIL
    Route::get('inail/{id}', 'D2_InailController@index');
    Route::post('inail', 'D2_InailController@store');
    Route::get('inail/details/{id}', 'D2_InailController@show');
    Route::put('inail/{id}', 'D2_InailController@update');

    // D.3 DATI TRIBUTARI
    Route::get('tributari/{id}', 'D3_TributariController@index');
    Route::post('tributari', 'D3_TributariController@store');
    Route::get('tributari/details/{id}', 'D3_TributariController@show');
    Route::put('tributari/{id}', 'D3_TributariController@update');

    // D.4 DATI FISCALI
    Route::get('fiscali/{id}', 'D4_FiscaliController@index');
    Route::post('fiscali', 'D4_FiscaliController@store');
    Route::get('fiscali/details/{id}', 'D4_FiscaliController@show');
    Route::put('fiscali/{id}', 'D4_FiscaliController@update');

    // D.5 DATI FISCALI PER RESIDENTI ALL'ESTERO
    Route::get('fiscoestero/{id}', 'D5_FiscaliEsteroController@index');
    Route::post('fiscoestero', 'D5_FiscaliEsteroController@store');
    Route::get('fiscoestero/details/{id}', 'D5_FiscaliEsteroController@show');
    Route::put('fiscoestero/{id}', 'D5_FiscaliEsteroController@update');

    // D.6 RICHIESTA DETRAZIONI FISCALI PER FAMILIARI A CARICO
    Route::get('familiari/{id}', 'D6_DetrazioniFamiliariController@index');
    Route::post('familiari', 'D6_DetrazioniFamiliariController@store');
    Route::get('familiari/details/{id}', 'D6_DetrazioniFamiliariController@show');
    Route::put('familiari/{id}', 'D6_DetrazioniFamiliariController@update');

    // E AUTONOMO OCCASIONALE
    Route::get('occasionale/{id}', 'E_OccasionaleController@index');
    Route::post('occasionale', 'E_OccasionaleController@store');
    Route::get('occasionale/details/{id}', 'E_OccasionaleController@show');
    Route::put('occasionale/{id}', 'E_OccasionaleController@update');

    // STORY PROCESS
    Route::get('story/{id}', 'StoryProcessController@show');
    Route::post('story', 'StoryProcessController@store');
    Route::get('story/prec/{id}', 'StoryProcessController@index');

    // EMAIL LIST
    Route::get('maillist/{id}', 'SendEmailController@show');
    Route::get('maillist/prec/{id}', 'SendEmailController@index');
    Route::post('maillist', 'SendEmailController@store');

    // TABELLA VALIDAZIONI
    Route::get('validazione/{id}', 'ValidazioniController@index');
    Route::post('validazione', 'ValidazioniController@store');
    Route::put('validazione/{id}', 'ValidazioniController@update');

    // PersonaInterna
    Route::post('personeinterne/query','PersonaInternaController@query');

    // StrutturaInterna
    Route::post('struttureinterne/query','StrutturaInternaController@query');
    Route::get('struttureinterne/{id}','StrutturaInternaController@getminimal');

    // StrutturaEsterna
    Route::post('struttureesterne/query','StrutturaEsternaController@query');
    Route::get('struttureesterne/{id}','StrutturaEsternaController@getminimal');

    // Documenti
    Route::post('documenti/query','DocumentoController@query');
    Route::get('documenti/{id}','DocumentoController@getminimal');
  
    //unità organizzativa
    Route::post('unitaorganizzative/query','UnitaOrganizzativaController@query');
    Route::get('unitaorganizzative/{id}','UnitaOrganizzativaController@getminimal');

    //allegati
    Route::get('attachments/download/{id}','AttachmentController@download');
    Route::delete('attachments/{id}','AttachmentController@deletefile');

    //mapping uffici
    Route::get('mappinguffici', 'MappingUfficioController@index');
    Route::get('mappinguffici/{id}', 'MappingUfficioController@show');
    Route::post('mappinguffici/query', 'MappingUfficioController@query'); 
    Route::post('mappinguffici', 'MappingUfficioController@store');
    Route::put('mappinguffici/{id}', 'MappingUfficioController@update');
    Route::delete('mappinguffici/{id}', 'MappingUfficioController@delete');


});



