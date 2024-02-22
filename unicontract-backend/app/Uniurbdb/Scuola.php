<?php


namespace App\Uniurbdb;

use Illuminate\Database\Eloquent\Model;

class Scuola extends Model
{

    const SCUOLA = 'scuola';

    protected $connection = 'off';  
    protected $table = 'scuola';

    protected $primaryKey = 'scuola_id';

    //protected $table = 'scuole';
//scuola_id, scuola_appartenenza, scuola_interdipartimentale, scuola_nome, scuola_nome_ENG, scuola_descrizione, scuola_presidente_id, scuola_coordinatore, scuola_coordinatore_titolo, scuola_mail_coordinatore, scuola_html, scuola_mail, scuola_mail_2, scuola_sitoweb_label, scuola_sitoweb, scuola_sitoweb_label_2, scuola_sitoweb_2, scuola_vc_id, pubblica
//'11', '6', NULL, 'Farmacia', 'Pharmacy', 'La Scuola (già Facoltà) di Farmacia è una delle più antiche Scuole dell\'Università degli Studi di Urbino Carlo Bo: studi di farmacia per il conseguimento di un apposito diploma esistono dal 1860 ma le sue radici risalgono al XVII secolo.\r\n\r\nLa Scuola di Farmacia di Urbino, nel solco della tradizione ma anche monitorando i mutamenti che le realtà professionali dei futuri laureati hanno subito nel corso dei decenni, si è posta come obiettivi primari la qualità della didattica e della sperimentazione ed è sempre stata e continua ad essere particolarmente sensibile a fornire tutti i mezzi necessari per l\'apprendimento e la formazione.\r\n\r\nUna presenza costante del personale e una forte attenzione alle esigenze culturali e del mondo del lavoro determinano le condizioni per una perfetta sinergia tra chi opera nella struttura e gli studenti.\r\n\r\nLa Scuola di Farmacia di Urbino è una scuola in crescita: sia numericamente sia qualitativamente. Un\'indagine svolta su un campione significativo di laureati della nostra Facoltà ci permette di affermare che circa il 90% di chi consegue il diploma di laurea trova lavoro entro sei mesi dal conseguimento del titolo di studio e nella stragrande maggioranza dei casi il tipo di occupazione è coerente con le conoscenze acquisite durante il percorso formativo.\r\n\r\nLo studente che si iscrive alla nostra Scuola ha la possibilità di vivere un\'esperienza formativa di livello anche per quanto riguarda la ricerca scientifica; i risultati del primo esercizio di valutazione triennale della ricerca condotto dal CIVR (Comitato di indirizzo per la valutazione della ricerca) hanno dimostrato che nella Scuola di Farmacia esistono dei centri di eccellenza dove si fa ricerca a livelli elevati e pertanto lo studente potrà maturare anche nel campo della sperimentazione un\'esperienza molto significativa e ben spendibile nella professione.', '100199', 'Prof. Gilberto Spadoni', 'Professore Ordinario', 'gilberto.spadoni@uniurb.it', '', 'scuola.farmacia@uniurb.it', '', NULL, 'https://www.uniurb.it/it/portale/dipartimento-index.php?mist_id=16601&tipo=DISB&page=03210', '', '', '3413', '1'


    public static function boot()
    {
        parent::boot();
        static::addGlobalScope('totale_scuola', function ($builder) {
            $builder->select(['scuola_id','scuola_appartenenza','scuola_nome','scuola_presidente_id','scuola_coordinatore','scuola_mail_coordinatore','scuola_mail']);
        });
    }

    // public function validazioni()
    // {
    //     return $this->morphMany(Validazione::class, 'struttura');
    // }
}
