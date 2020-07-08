<?php
namespace Tests\Unit;
use Storage;
use Auth;

class ContrattiData 
{

    public static function getArrayDocente(){
        return [            
            'name' => "Marco Angeloni",
            'nome'=>"Marco",
            'cognome'=>"Angeloni",
            'cf'=>"NGLMRC86M26H294M",
            'email'=>"marco.angeloni@uniurb.it",
            'v_ie_ru_personale_id_ab'=>"26686",
            'password'=>null
        ];        
    }

    public static function getAnagrafica($insegn_id){
        return [
            'comune_nascita' => "RIMINI",
            'provincia_nascita' => "RN",
            'data_nascita' => "26-08-1986",
            'stato_civile' => "C",
            'cf' => "NGLMRC86M26H294M",
            'cf_coniuge' => null,
            'nazione_residenza' => "SAMMARINESE",
            'titolo_studio' => "Dottore",
            'comune_residenza' => "SAN MARINO",
            'provincia_residenza' => "EE",
            'cap_residenza' => "99999",
            'indirizzo_residenza' => "STRADA SERRABOLIVO",
            'civico_residenza' => "137",
            'comune_fiscale' => "NOVAFELTRIA",
            'provincia_fiscale' => "RN",
            'cap_fiscale' => "47863",
            'indirizzo_fiscale' => "VIA ENRICO FERMI",
            'civico_fiscale' => "1",
            'telefono_cellulare' => "555555",
            'telefono_abitazione' => null,
            'telefono_ufficio' => null,
            'email' => "marco.angeloni@uniurb.it",
            'email_privata' => "angeloni15@gmail.com",
            'attachments' => [],
            'sesso' => "M",
            'id_ab' => "26686",
            'insegn_id' => $insegn_id,
            'originalValue' => [
                'nazione_residenza' => "SAMMARINESE",
                'comune_residenza' => "SAN MARINO1",
                'provincia_residenza' => "EE",
                'cap_residenza' => "99999",
                'indirizzo_residenza' => "STRADA SERRABOLIVO",
                'civico_residenza' => "137",
                'comune_fiscale' => "NOVAFELTRIA",
                'provincia_fiscale' => "RN",
                'cap_fiscale' => "47863",
                'indirizzo_fiscale' => "VIA ENRICO FERMI",
                'civico_fiscale' => "1",
            ],
        ];
    }

    public static function getP2Rapporto($insegn_id){
        return [                        
            'p2id' => 4,
            'flag_rapp_studio_univ' => 1,
            'flag_dipend_pubbl_amm' => 1,
            'flag_titolare_pensione' => false,
            'natura_rapporto' => "PRPR",
            'insegn_id' => $insegn_id,
            'originalValue' => [],
        ];
    }

    public static function  getConflitto($insegn_id){
        return [                  
            'flag_controll' => 0,         
            'flag_quota' => 0,
            'flag_rappext' => 0,
            'flag_contrast' => 0,
            'flag_cariche' => 0,
            'flag_incarichi' => 0,
            'flag_attivita' => 0,
            'insegn_id' => $insegn_id,
        ];
    }

    public static function getArrayInsegnamento(){
        return [
            'coper_id'=>"24550",
            'ruolo'=>"CC",
            'insegnamento'=>"LABORATORIO DI ORGANIZZAZIONE",
            'settore'=>"Indefinito/Interdisciplinare",
            'cod_settore'=>"NN",
            'cfu'=>"3",
            'ore'=>"25",
            'cdl'=>"SCIENZE DELL'EDUCAZIONE",
            'data_ini_contr'=>"22-11-2019",
            'data_fine_contr'=>"20-12-2019",
            'ciclo'=>"Ciclo Annuale Unico",
            'aa'=>"2019",
            'dipartimento'=>"Dipartimento di Studi Umanistici (DISTUM)",
            'compenso'=>"625",
            'tipo_contratto'=>"INTU",
            'tipo_atto'=>"Delibera",
            'emittente'=>"Consiglio di Dipartimento",
            'motivo_atto'=>"CONF_INC",
            'num_delibera'=>"124/2019",
            'data_delibera'=>"2019-02-10 00:00:00",
            'cod_insegnamento'=>"A000898",
            'dip_cod'=>"004939",
        ];
    }

    public static function getArrayContratti(){
        return [
            'coper_id' => "26093",
            'ruolo' => "CC",
            'insegnamento' => "CONTRATTO INTEGRATIVO DI TEORIA, TECNICA E DIDATTICA DEGLI SPORT INDIVIDUALI =>  GINNASTICA ARTISTICA MODULO 5",
            'settore' => "METODI E DIDATTICHE DELLE ATTIVITÀ SPORTIVE",
            'cod_settore' => "M-EDF/02",
            'cfu' => "3",
            'ore' => "60",
            'cdl' => "SCIENZE MOTORIE, SPORTIVE E DELLA SALUTE",
            'data_ini_contr' => "01-10-2019",
            'data_fine_contr' => "30-09-2020",
            'ciclo' => "Ciclo Annuale Unico",
            'aa' => "2019",
            'dipartimento' => "Dipartimento di Scienze Biomolecolari (DISB)",
            'compenso' => "2500",
            'tipo_contratto' => "INTU",
            'tipo_atto' => "Delibera",
            'emittente' => "Consiglio di Dipartimento",
            'motivo_atto' => "CONF_INC",
            'num_delibera' => "190",
            'data_delibera' => "2019-09-04 00:00:00",
            'cod_insegnamento' => "A001385",
            'cod_dip' => '005019'
        ];               
    }

    public static function getPrestazioneProfessionale($insegn_id){
        return [
            'insegn_id' => $insegn_id,
            'entity'=> [           
                'piva' => '99999999999',
                'intestazione' => 'Presatazione professionale',
                'tipologia' => 1,
                'flag_albo' => 0,
                'denominazione_albo' => '',
                'provincia_albo' => '',
                'num_iscrizione_albo' => '',
                'data_iscrizione_albo' => '',
                'flag_cassa' => 1,
                'denominazione_cassa' => 'INPS',
                'contributo_cassa' => 0,
                'flag_rivalsa' => 0,
                'flag_regime_fiscale' => 0     
            ]       
        ];
    }

    public static function getPrecontrattuale(){
        return [
            'insegnamento' => ContrattiData::getArrayInsegnamento(),
            'docente' => ContrattiData::getArrayDocente(),
        ];
    }

    public static function getNewIncomp($insegn_id){
        return [
            'insegn_id' => $insegn_id,
            'entity'=> [
                'flag_incompatibilita' => true,
            ]            
        ];
    }

    public static function getNewPrivacyInformativa($insegn_id){
        return [
            'insegn_id' => $insegn_id,
            'entity'=> [
                'flag1' => true,
                'flag2' => true,
            ]            
        ];
    }

    public static function getB2Incompatibilita(){
        return [
            'flag_incompatibilita' => true,
        ];
    }

}