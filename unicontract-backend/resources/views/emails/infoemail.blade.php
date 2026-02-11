@component('mail::message')
Gentile {{ $pre->user->nameTutorString() }},<br>
<br>
con riferimento all'incarico di insegnamento di<br>
{{ $pre->insegnamento->insegnamentoDescr }} (anno accademico {{$pre->aa}})<br>
presso il {{ $pre->insegnamento->dipartimento }}<br>
dell'Università degli Studi di Urbino Carlo Bo,<br>
si segnalano le seguenti modifiche/integrazioni da apportare<br>
**il più presto possibile** alla modulistica precontrattuale:<br>

{{ $entity['corpo_testo'] }}

@component('mail::button', ['url' => $urlUniContr])
Revisione modulistica precontrattuale
@endcomponent

Per eventuali informazioni o richieste di chiarimento,<br>
può far riferimento ai recapiti di seguito indicati.

Cordiali saluti.

@include( 'emails.firmamessaggioamministrazione')
@endcomponent