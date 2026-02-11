@component('mail::message')
Gentile {{ $pre->user->nameTutorString() }},<br>
<br>
con riferimento all'incarico di insegnamento di<br>
{{ $pre->insegnamento->insegnamentoDescr }} (anno accademico {{$pre->aa}})<br>
presso il {{ $pre->insegnamento->dipartimento }}<br>
dell'Università degli Studi di Urbino Carlo Bo,<br>
La informiamo che la modulistica precontrattuale da Lei compilata<br>
è stata verificata e validata dagli uffici competenti, pertanto<br>
La invitiamo a prendere visione del contratto in tutte le sue parti<br>
e a confermare la sua accettazione con la firma **il più presto possibile**<br>
collegandosi di nuovo alla piattaforma [UniContr]({{$urlUniContr}}):

@component('mail::button', ['url' => $urlUniContr])
Accedi alla piattaforma per firmare il contratto
@endcomponent

Per eventuali informazioni o richieste di chiarimento,<br>
può far riferimento ai recapiti di seguito indicati.

Cordiali saluti.

@include( 'emails.firmamessaggioamministrazione')
@endcomponent
