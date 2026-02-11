<?php

namespace App\Models;

use Jenssegers\Model\Model;
use Carbon\Carbon;

class Documento extends Model {

    //[docnumprot]: numero protocollo nella forma <anno>-<cod.amm.+cod.aoo>-<numero 7 cifre>
    //[doc_repertorionumero]: numero di repertorio nella forma <codice>^<cod.amm.+cod.aoo>-<anno><numero 7 cifre>
    public $elementName = 'doc';

    protected $fillable = [
        'physdoc',
        'nrecord',              
        'tipo',
        'anno',
        'num_prot',
        'data_prot',
        'oggetto'
    ];
    
    protected $hidden = ['physdoc'];

    protected $queryparam = [
        'doc_bozza',	
        'doc_rifinternirifdirittocodpersonacodfasc',				
        'doc_annullato',	
        'docnumprot',			
        '/doc/@num_prot',					        
        'doc_anno',	
        'doc_oggetto',	
        'doc_classifcod'	  
    ];

    public $querykey = '([UD,/xw/@UdType/]=doc)';
    
    protected $casts = [
        'data_prot' => 'datetime:d-m-Y',
    ];

    public function getDataProtAttribute($input){
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Ymd', $input)->format(config('unidem.date_format'));
        }else{
            return '';
        }
    }
}