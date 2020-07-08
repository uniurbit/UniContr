@component('mail::message')
Gentile {{ $pre->user->nameTutorString() }},<br>
<br>
con riferimento all'incarico di insegnamento di<br>
{{ $pre->insegnamento->insegnamentoDescr }} (anno accademico {{$pre->aa}})<br>
presso il {{ $pre->insegnamento->dipartimento }}<br>
dell'Università degli Studi di Urbino Carlo Bo,<br>
Le ricordiamo che la modulistica precontrattuale da Lei compilata<br>
è stata verificata e validata dagli uffici competenti,<br>
La invitiamo a prendere visione del contratto in tutte le sue parti<br>
e a confermare la sua accettazione **il più presto possibile**<br>
collegandosi di nuovo alla piattaforma UniContr:

@component('mail::button', ['url' => $urlUniContr])
Visione e accettazione contratto 
@endcomponent

Per eventuali informazioni o richieste di chiarimento,<br>
può far riferimento ai recapiti di seguito indicati.

Cordiali saluti.
@component('mail::sign')
@include( 'emails.firmamessaggioamministrazione')
@endcomponent
@endcomponent
