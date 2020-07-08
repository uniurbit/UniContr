<h4>B.5: DICHIARAZIONE IN MERITO ALLO STATO DI PENSIONAMENTO</h4>
<p class="normal">    
    Si dichiara in qualità di @if($pre->anagrafica->sesso == 'M') pensionato @else pensionata @endif di vecchiaia / anzianità di non trovarsi nella situazione di incompatibilità prevista dall'art. 25 della Legge 724/1994 e, in particolare, di: <br>

    @if($pre->b5statopensionamento()->first()->status == "PNDA") 
        - essere attualmente pensionato, ma non era dipendente di una Amministrazione Pubblica di cui all'art.1, comma 2 del D.Lgs. 29/1993.
    @elseif($pre->b5statopensionamento->status == "CSPA") 
        - essere cessato dal servizio da una Pubblica Amministrazione avendo raggiunto il requisito previsto per il pensionamento di vecchiaia dai rispettivi ordinamenti previdenziali.
    @elseif($pre->b5statopensionamento->status == "CVPA") 
        - essere cessato volontariamente dal servizio da una Pubblica Amministrazione non avendo il requisito previsto per il pensionamento di vecchiaia dai rispettivi ordinamenti previdenziali, ma avendo il requisito contributivo per l'ottenimento della pensione anticipata di anzianità.
    @elseif($pre->b5statopensionamento->status == "RURL") 
        - essere cessato dal servizio da una Pubblica Amministrazione che si è avvalsa dell’istituto della risoluzione unilaterale del rapporto di lavoro, ai sensi dell'art.17, comma 35 novies della legge 3/8/2009, n.102.
    @endif
    <br>
    - nei cinque anni precedenti 
    @if($pre->b5statopensionamento->flag_rapp_collab_universita == 1) 
        ha avuto rapporti di collaborazione con l'Università degli Studi di Urbino Carlo Bo <br>
    @else
        non ha avuto rapporti di collaborazione con l'Università degli Studi di Urbino Carlo Bo <br>
    @endif   
</p>
<br>
<p class="piepagina">    
    Dichiarazione resa da {{$pre->user->nome}} {{$pre->user->cognome}} in data {{ $pre->b5statopensionamento->updated_at ? $pre->b5statopensionamento->updated_at->format('d-m-Y') : $pre->b5statopensionamento->created_at->format('d-m-Y')}} <br>
</p>