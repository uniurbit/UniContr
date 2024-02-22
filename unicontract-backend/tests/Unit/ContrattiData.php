<?php
namespace Tests\Unit;
use Storage;
use Auth;

class ContrattiData 
{

    //** U-SIGN */

    public static function getCreateProcessResponse(){
      return '{
        code : 200,
        message  : "21234-qwerty-5678"
      }';
    }

    public static function getSendToFEAResponse(){
    return '{
        "debugMode": true,
        "documents": {},
        "feaResponse": {},
        "otpPerEnrollment": true,
        "signer": {
          "codFisc": "LVONRC76C29L500F",
          "cognome": "Oliva",
          "nome": "Enrico",
          "telefono": "3282282328"
        },
        "token": "091a32b4-6294-4681-9743-536555eff2ff",
        "uniservUrl": "bbbb"
      }';
    }

    //** APP IO */

    public static function getValidateDocument(){
      return '{
        "is_valid": false,
        "violations": [
           "(clause 1) incompatible coordinates: unable to find page 3 in the uploaded document"
        ]
     }';
    }

    public static function getCreateDossierResponse(){
        return '{
            "id":"01GG4NFBCN4ZH8ETCCKX3766KX",
            "title": "Contratto di insegnamento",
            "documents":[
               {
                  "title":"Contratto",
                  "signature_fields":[
                     {
                        "unique_name":"Signature1",
                        "clause":{
                           "title":"Firma contratto",
                           "type":"REQUIRED"
                        }
                     }
                  ]
               }
            ]
         }';
    }

    public static function getSignatureRequestResponseREADY(){
      return ContrattiData::getSignatureRequestResponse('READY');
    } 

    public static function getSignatureRequestResponseDRAFT(){
      return ContrattiData::getSignatureRequestResponse('DRAFT');
    } 

    public static function getSignatureRequestResponse($status){
        //"status": "DRAFT",
        return '{
            "id": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
            "status": "'.$status.'",
            "dossier_id": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
            "signer_id": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
            "expires_at": "2018-10-13T00:00:00.000Z",
            "documents": [
              {
                "id": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
                "metadata": {
                  "title": "string",
                  "signature_fields": [
                    {
                        "attrs": {
                            "coordinates": {
                               "x": 112,
                               "y": 510
                            },
                            "size": {
                               "w": 140,
                               "h": 40
                            },
                            "page": 0
                         },
                      "clause": {
                        "title": "Firma contratto",
                        "type": "REQUIRED"
                      }
                    }
                  ]
                },
                "created_at": "2018-10-13T00:00:00.000Z",
                "updated_at": "2018-10-13T00:00:00.000Z",
                "status": "WAIT_FOR_UPLOAD"
              },
              {
                "id": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
                "metadata": {
                  "title": "string",
                  "signature_fields": [
                    {
                      "attrs": {
                        "unique_name": "string"
                      },
                      "clause": {
                        "title": "string",
                        "type": "REQUIRED"
                      }
                    }
                  ]
                },
                "created_at": "2018-10-13T00:00:00.000Z",
                "updated_at": "2018-10-13T00:00:00.000Z",
                "status": "WAIT_FOR_VALIDATION",
                "uploaded_at": "2018-10-13T00:00:00.000Z"
              },
              {
                "id": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
                "metadata": {
                  "title": "string",
                  "signature_fields": [
                    {
                      "attrs": {
                        "unique_name": "string"
                      },
                      "clause": {
                        "title": "string",
                        "type": "REQUIRED"
                      }
                    }
                  ]
                },
                "created_at": "2018-10-13T00:00:00.000Z",
                "updated_at": "2018-10-13T00:00:00.000Z",
                "status": "READY",
                "uploaded_at": "2018-10-13T00:00:00.000Z",
                "url": "string"
              },
              {
                "id": "01ARZ3NDEKTSV4RRFFQ69G5FAV",
                "metadata": {
                  "title": "string",
                  "signature_fields": [
                    {
                      "attrs": {
                        "unique_name": "string"
                      },
                      "clause": {
                        "title": "string",
                        "type": "REQUIRED"
                      }
                    }
                  ]
                },
                "created_at": "2018-10-13T00:00:00.000Z",
                "updated_at": "2018-10-13T00:00:00.000Z",
                "status": "REJECTED",
                "uploaded_at": "2018-10-13T00:00:00.000Z",
                "rejected_at": "2018-10-13T00:00:00.000Z",
                "reject_reason": "string"
              }
            ],
            "notification": {
              "io_message_id": "string"
            },
            "created_at": "2018-10-13T00:00:00.000Z",
            "updated_at": "2018-10-13T00:00:00.000Z",
            "signed_at": "2018-10-13T00:00:00.000Z",
            "rejected_at": "2018-10-13T00:00:00.000Z",
            "reject_reason": "string",
            "qr_code_url": "string",
            "cancelled_at": "2018-10-13T00:00:00.000Z"
          }';
    }

    public static function getArrayDocente(){
        return [            
            'name' => "Enrico Oliva",
            'nome'=>"Enrico",
            'cognome'=>"Oliva",
            'cf'=>"LVONRC76C29L500F",
            'email'=>"enrico.oliva@uniurb.it",
            'v_ie_ru_personale_id_ab'=>"39842",
            'password'=>null
        ];        
    }

    public static function getAnagrafica($insegn_id){
        return [
            'comune_nascita' => "PESARO",
            'provincia_nascita' => "PU",
            'data_nascita' => "29-03-1976",
            'stato_civile' => "C",
            'cf' => "LVONRC76C29L500F",
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
            'email' => "enrico.oliva@uniurb.it",
            'email_privata' => "oliva.enrico@gmail.com",
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

    public static function getA2ModalitaPagamento($insegn_id){
        return [
            'insegn_id' => $insegn_id,
            'modality' => "ACIC",
            'intestazione' => "Cleri Bonita",
            'iban' => "IT33U0311168280000000005966",
            'denominazione' => "UBI Banca",
            'luogo' => "Fermignano",
            'bic' => null,
            'aba' => null,
            'originalValue' => [
                'modality' => "ACIC",
                'intestazione' => "Cleri Bonita",
                'iban' => "IT33U0311168280000000005966",
                'denominazione' => "UBI Banca",
                'luogo' => "Fermignano",
            ]
        ];
    }

    public static function getValidazioneEconomica($insegn_id){
        return [
            'insegn_id' => $insegn_id,
            'entity' => [
                'flag_amm' => true
            ]
        ];
    }

}