<?php

namespace App\Models\Titulus;

use Spatie\ArrayToXml\ArrayToXml;

// /doc/@tipo	tipo (“arrivo” o “partenza” o “interno” o “varie”)
// /doc/@cod_amm_aoo	codice AMMAOO
// /doc/@anno	anno di inserimento (4 cifre)
// /doc/@data_prot	data di protocollazione (nella forma “aaaammgg”)
// /doc/@annullato	se vale “si”, significa che il documento è stato annullato
// /doc/@bozza	se vale “si”, significa che il documento è una bozza

class DocumentoAttributi
{
    public $tipo;
    public $cod_amm_aoo;
    public $anno;
    public $data_prot;
    public $annullato;
    public $bozza;
}