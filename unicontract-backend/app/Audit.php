<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Audit extends Model
{
    protected $table = 'audit';

    protected $fillable = [
        'field_name',
        'old_value',
        'new_value',
    ];


    public static $toTrace = [
        'nazione_residenza',
        'comune_residenza',
        'provincia_residenza',
        'cap_residenza',
        'indirizzo_residenza',
        'civico_residenza',
        'data_variazione_residenza',
        'comune_fiscale',
        'provincia_fiscale',
        'cap_fiscale',
        'indirizzo_fiscale',
        'civico_fiscale',
        'data_variazione_dom_fiscale',
        'iban'
    ];

    protected $casts = [
        'created_at' => 'datetime:d-m-Y',        
    ];
    
}
