<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Convenzione;
use App\MappingRuolo;
use App\Role;
use App\Personale;
use App\Precontrattuale;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

//php artisan db:seed --class=DatiSeeder
//composer dump-autoload -o 

////php artisan migrate:fresh --seed
class DatiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {                       
        $this->attachmenttypes();                  
        $this->mappingtable();        
        $this->mappingruoli();        
    }

  

    private function onlyFirstUpper($value){
        return ucwords(mb_strtolower($value, 'UTF-8'));
    }

    
    private function insertOffice(Array $offices, $rolename){
        $role = Role::where('name', $rolename)->first();
        foreach ($offices as $office) {
            $mp = new MappingRuolo();
            $mp->unitaorganizzativa_uo = $office;
             // Only try to read from Oracle in non-testing environments
             if (!app()->environment('testing')) {
                $uo = $mp->unitaorganizzativa()->get()->first();
                if ($uo) {
                    $mp->descrizione_uo = $uo->descr;
                    $mp->role_id = $role->id;
                    $mp->save();
                }
            } else {
                // Fake description for testing/CI
                $mp->descrizione_uo = "Fake descr for $office";
                $mp->role_id = $role->id;
                $mp->save();
            } 
        }       
    }

    /**
     * Check if Oracle connection is alive
     */
    private function oracleConnected(): bool
    {
        try {
            DB::connection('oracle')->getPdo();
            return true;
        } catch (\Exception $e) {
            // Could not connect
            return false;
        }
    }
    
    /**
     * Tabella di corrispondenza tra unità organizzativa e ruolo
     *
     * @return void
     */
    public function mappingruoli(){
    
        $this->insertOffice(config('unidem.unitaSuperAdmin'), 'super-admin');
        $this->insertOffice(config('unidem.unitaAdmin'), 'admin');
        $this->insertOffice(config('unidem.ufficiPerValidazione'), 'op_approvazione');    

        $this->insertOffice(['005144'], 'op_approvazione_amm');
        $this->insertOffice(['005343'], 'op_approvazione_economica');

        $this->insertOffice(['005019','004919','004940','004939','004424','004419','004960','004961','005199'], 'op_dipartimentale');                    
    }

    
    /**
     * Tabella di corrispondenza unità organizzativa e struttura interna
     *
     * @return void
     */
    public function mappingtable(){
        
        DB::table('mappinguffici')->insert([                          
            'unitaorganizzativa_uo' => '005199',
            'descrizione_uo' => 'Plesso Scientifico (DiSPeA-DiSB)',                     
            'strutturainterna_cod_uff' => 'SI000083',
            'descrizione_uff' => 'Plesso Scientifico (DISPeA e DISB)',                     
        ]);

        DB::table('mappinguffici')->insert([                          
            'unitaorganizzativa_uo' => '005361',
            'descrizione_uo' => 'Ufficio Ricerca e Relazioni Internazionali - Sett. Ric. e Terza miss.',                     
            'strutturainterna_cod_uff' => 'SI000048',
            'descrizione_uff' => 'Ufficio Ricerca e Relazioni Internazionali',                     
        ]);

        if (App::environment('local') || App::environment('preprod')) {
            DB::table('mappinguffici')->insert([                          
                'unitaorganizzativa_uo' => '005400',
                'descrizione_uo' => 'Servizi Sistemi e Software Gestionali e Documentali - Settore ICT - Area ICT e Comunicazione',                     
                'strutturainterna_cod_uff' => 'SI000099',
                'descrizione_uff' => 'Servizi Sistemi e Software Gestionali e Documentali',                     
            ]);
        }else{
            DB::table('mappinguffici')->insert([                          
                'unitaorganizzativa_uo' => '006305',
                'descrizione_uo' => 'Servizi Sistemi e Software Gestionali e Documentali - Settore ICT - Area ICT e Comunicazione',                     
                'strutturainterna_cod_uff' => 'SI000099',
                'descrizione_uff' => 'Servizi Sistemi e Software Gestionali e Documentali',                     
            ]);
        }


        //004939	Dipartimento di Studi Umanistici (DISTUM) Dipartimento di Studi Umanistici (DISTUM) SI000089 PI000073
        DB::table('mappinguffici')->insert([                          
            'unitaorganizzativa_uo' => '004939',
            'descrizione_uo' => 'Dipartimento di Studi Umanistici (DISTUM)',                     
            'strutturainterna_cod_uff' => 'SI000089',
            'descrizione_uff' => 'Dipartimento di Studi Umanistici (DISTUM)',                     
        ]);
        
        //004424	Dipartimento di Economia, Società, Politica (DESP) - Dipartimento di Economia, Società, Politica (DESP) SI000058 PI000073
        DB::table('mappinguffici')->insert([                          
            'unitaorganizzativa_uo' => '004424',
            'descrizione_uo' => 'Dipartimento di Economia, Società, Politica (DESP)',                     
            'strutturainterna_cod_uff' => 'SI000058',
            'descrizione_uff' => 'Dipartimento di Economia, Società, Politica (DESP)',                     
        ]);

        //004419	Dipartimento di Giurisprudenza - Dipartimento di Giurisprudenza SI000062 PI000056
        DB::table('mappinguffici')->insert([                          
            'unitaorganizzativa_uo' => '004419',
            'descrizione_uo' => 'Dipartimento di Giurisprudenza',                     
            'strutturainterna_cod_uff' => 'SI000062',
            'descrizione_uff' => 'Dipartimento di Giurisprudenza',                     
        ]);

        //004940	Dipartimento di Scienze della Comunicazione, Studi Umanistici e Internazionali: Storia, Culture, Lingue, Letterature, Arti, Media (DISCUI) - Dipartimento di Scienze della Comunicazione, Studi Umanistici e Internazionali: Storia, Culture, Lingue, Letterature, Arti, Media - DISCUI SI000087 PI000056
        DB::table('mappinguffici')->insert([                          
            'unitaorganizzativa_uo' => '004940',
            'descrizione_uo' => 'Dipartimento di Scienze della Comunicazione, Studi Umanistici e Internazionali: Storia, Culture, Lingue, Letterature, Arti, Media (DISCUI)',                     
            'strutturainterna_cod_uff' => 'SI000087',
            'descrizione_uff' => 'Dipartimento di Scienze della Comunicazione, Studi Umanistici e Internazionali: Storia, Culture, Lingue, Letterature, Arti, Media - DISCUI',                     
        ]);
            

        //005579	Dipartimento di Scienze della Comunicazione, Studi Umanistici e Internazionali (DISCUI) SI000087 PI000056
        DB::table('mappinguffici')->insert([                          
            'unitaorganizzativa_uo' => '005579',
            'descrizione_uo' => 'Dipartimento di Scienze della Comunicazione, Studi Umanistici e Internazionali (DISCUI)',                     
            'strutturainterna_cod_uff' => 'SI000087',
            'descrizione_uff' => 'Dipartimento di Scienze della Comunicazione, Studi Umanistici e Internazionali: Storia, Culture, Lingue, Letterature, Arti, Media - DISCUI',                     
        ]);


        //005019	Dipartimento di Scienze Biomolecolari (DISB) - Dipartimento di Scienze Biomolecolari SI000060 PI000083
        DB::table('mappinguffici')->insert([                          
            'unitaorganizzativa_uo' => '005019',
            'descrizione_uo' => 'Dipartimento di Scienze Biomolecolari (DISB)',                     
            'strutturainterna_cod_uff' => 'SI000060',
            'descrizione_uff' => 'Dipartimento di Scienze Biomolecolari',                     
        ]);

        
        //004919	Dipartimento di Scienze Pure e Applicate (DiSPeA) - Dipartimento di Scienze Pure e Applicate - DISPeA SI000084 PI000083
        DB::table('mappinguffici')->insert([                          
            'unitaorganizzativa_uo' => '004919',
            'descrizione_uo' => 'Dipartimento di Scienze Pure e Applicate (DiSPeA)',                     
            'strutturainterna_cod_uff' => 'SI000084',
            'descrizione_uff' => 'Dipartimento di Scienze Pure e Applicate - DISPeA',                     
        ]);

    }  
    
    /**
     * Tipi di allegato
     *
     * @return void
     */
    public function attachmenttypes(){
        DB::table('attachmenttypes')->insert([   
            'codice' => 'DOC_CV',        
            'gruppo' => 'anagrafica',
            'descrizione' => 'Curriculum',
            'descrizione_compl' => 'Curriculum',         
            'parent_type' => User::class,   
        ]);

        DB::table('attachmenttypes')->insert([   
            'codice' => 'DOC_CI',        
            'gruppo' => 'anagrafica',
            'descrizione' => 'Carta di identità',  
            'descrizione_compl' => 'Carta di identità',        
            'parent_type' => User::class,    
        ]);

        DB::table('attachmenttypes')->insert([   
            'codice' => 'AUT_PA',        
            'gruppo' => 'B4RapportoPA',
            'descrizione' => 'Autorizzazione PA',  
            'descrizione_compl' => 'Autorizzazione Pubblica Amministrazione',        
            'parent_type' => B4RapportoPA::class,    
        ]);
        
        DB::table('attachmenttypes')->insert([   
            'codice' => 'CONTR_BOZZA',        
            'gruppo' => 'Precontrattuale',
            'descrizione' => 'Contratto bozza',  
            'descrizione_compl' => 'Contratto in stato di bozza',        
            'parent_type' => Precontrattuale::class,    
        ]);
        DB::table('attachmenttypes')->insert([   
            'codice' => 'CONTR_FIRMA',        
            'gruppo' => 'Precontrattuale',
            'descrizione' => 'Contratto',  
            'descrizione_compl' => 'Contratto',        
            'parent_type' => Precontrattuale::class,    
        ]);        

        DB::table('attachmenttypes')->insert([   
            'codice' => 'DOM_GS',        
            'gruppo' => 'D1_Inps',
            'descrizione' => 'Iscrizione GS',  
            'descrizione_compl' => 'Domanda di iscrizione alla Gestione Separata',        
            'parent_type' => D1_Inps::class,
        ]);
     
    }
}
