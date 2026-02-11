<?php

namespace App\Service;

use App\FindParameter;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\QueryBuilder;

class UtilService {

    public static function alldata($modelinstance, Request $request, $findparam){

        $findparam->limit = 10000;
        $findparam->page = null;
        
        $paginator = UtilService::query($modelinstance, $request, $findparam);
        $collection = collect($paginator->items());
       
        $page = 1;
        $total = $paginator->total();

        while($collection->count() < $total) {            
            $page = $page+1;

            $findparam->page = $page;
            
            $p = UtilService::query($modelinstance, $request, $findparam);   
            $collection = $collection->concat($p->items());
        }

        return $collection;
    }

    private static function query($modelinstance, Request $request, $findparam){        
        $queryBuilder = new QueryBuilder($modelinstance, $request, $findparam);
        $queryBuilder->alias = ['precontr.id'];
        return $queryBuilder->build()->paginate();        
    }

    public static function tipoConferimento($value) {
        if ($value === 'BAN_INC' || $value === 'APPR_INC') {
            return 'Nuovo contratto';
        } else if ($value === 'CONF_INC') {
            return 'Rinnovo contratto';
        } else {
            return 'Non definito';
        }
    }

    public static function tipoContratto($value) {
        if ($value === 'ALTQG' || $value === 'ALTQC' || $value === 'ALTQU') {
            return 'Contratto di Alta Qualificazione';
        } else if ($value === 'CONTC' || $value === 'CONTU') {
            return 'Contratto di Didattica Ufficiale';
        } else if ($value === 'INTC'
                  || $value === 'INTU'
                  || $value === 'INTXU'
                  || $value === 'INTXC') {
            return 'Contratto di Didattica Integrativa';
        } else if ($value === 'SUPPU' || $value === 'SUPPC') {
            return 'Contratto di Supporto alla Didattica';
        } else {
            return 'Tipologia di contratto non definita';
        }
    }

    public static function naturaRapporto($p2naturarapporto) {
        if ($p2naturarapporto){
           return $p2naturarapporto->naturaRapportoToString();
        }else {
            return 'Non definito';
        }
      }

}