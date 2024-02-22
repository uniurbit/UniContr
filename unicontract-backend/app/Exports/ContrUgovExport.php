<?php

namespace App\Exports;

use App\Precontrattuale;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Service\UtilService;
use App\Models\Ugov\ContrUgov;
use App\Http\Controllers\Api\V1\QueryBuilderForceInsensitive;

class ContrUgovExport implements FromCollection, WithMapping, WithHeadings
{

    use Exportable;

    public function __construct($request, $findparam, $precontrs)
    {
        $this->request = $request;
        $this->findparam = $findparam;
        $this->precontrs = $precontrs;
    }
      

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {               

        $this->findparam->limit = 10000;
        $this->findparam->page = null;
        
        $paginator =  (new QueryBuilderForceInsensitive(new ContrUgov, $this->request,  $this->findparam))->build()->paginate();
        $collection = collect($paginator->items());
       
        $page = 1;
        $total = $paginator->total();

        while($collection->count() < $total) {            
            $page = $page+1;

            $this->findparam->page = $page;
            
            $p = (new QueryBuilderForceInsensitive(new ContrUgov, $this->request,  $this->findparam))->build()->paginate();   
            $collection = $collection->concat($p->items());
        }

        foreach ($collection as $result) {
            $pre = $this->precontrs->first(function ($value, $key) use($result) {
                return $value->insegnamento->coper_id == $result->id_siadi;
            });            
            $result['precontr'] = $pre;            
        }

        return $collection;

    }

      /**
    * @var Precontrattuale $precontr
    */
    public function map($cont): array
    {    

        return [
            $cont->datibase ? $cont->datibase->id_dg : '',
           
            $cont->precontr->user->cognome ? $cont->precontr->user->cognome : '',
            $cont->precontr->user->nome ? $cont->precontr->user->nome : '',
            $cont->precontr->insegnamento->data_ini_contr ? $cont->precontr->insegnamento->data_ini_contr : '',
            $cont->precontr->insegnamento->data_fine_contr ? $cont->precontr->insegnamento->data_fine_contr : '',

            $cont->id_uo_aff ? __('global.'.$cont->id_uo_aff) : '', //Dipartimento
            $this->getScuola($cont->precontr), //scuola

            $cont->datibase ? $cont->datibase->anno_rif: '', //Anno
            $cont->datibase ? $cont->datibase->ds_dg: '', //Descrizione
            $cont->datibase ? $cont->datibase->stato_dg: '',

            $cont->num_rate ? $cont->num_rate: '',
            
            $cont->statocompensi ? $cont->statocompensi : '',
            $cont->statoordinativi ? $cont->statoordinativi : '',

            $cont->id_siadi ? $cont->id_siadi : '',
           
        ];
    }

    public function headings(): array
    {
        return [
            'Id dg',
            'Cognome',
            'Nome',
            'Data inizio contratto',
            'Data fine contratto',
            'Dipartimento',
            'Scuola',
            'Anno',
            'Descrizione',

            'Stato contabile',
            'Num. rate',
            'Compensi',
            'Ordinativi',
            'Copertura',
        ];
    }

    public function annoAccademico($perirodoInizio)
    {
        return ($perirodoInizio.'/'.($perirodoInizio+1));
    }

    public function getScuola($precontr){
        $result = '';
        if ($precontr->insegnamento) {
            if ($precontr->insegnamento->corsodistudio) {
                $corsodistudio = $precontr->insegnamento->corsodistudio->where('aa', $this->annoAccademico((int)$precontr->insegnamento->aa))->first();
                
                if ($corsodistudio) {
                    $result = $corsodistudio->scuola->scuola_nome;
                }
            }
        }

        return $result;
    }
}
