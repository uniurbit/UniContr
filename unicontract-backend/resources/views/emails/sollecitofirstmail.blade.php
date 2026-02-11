@component('mail::message')
Gentile {{ $pre->user->nameTutorString() }},<br>
<br>
con riferimento all'incarico di insegnamento di<br>
{{ $pre->insegnamento->insegnamentoDescr }} (anno accademico {{$pre->aa}})<br>
presso il {{ $pre->insegnamento->dipartimento }}<br>
dell'Università degli Studi di Urbino Carlo Bo,<br>
Le ricordiamo di collegarsi **il più presto possibile**<br>
alla piattaforma [UniContr]({{$urlUniContr}})<br>
per la compilazione online della modulistica precontrattuale<br>
necessaria alla definizione del contratto:

@component('mail::button', ['url' => $urlUniContr])
Compilazione modulistica precontrattuale
@endcomponent

Nel caso avesse in precedenza compilato la modulistica per altre docenze,<br>
troverà le informazioni da Lei già inserite in passato,<br>
che dovrà pertanto solo verificare e aggiornare ove necessario.<br>
<br>
Per eventuali informazioni o richieste di chiarimento,<br>
può far riferimento ai recapiti di seguito indicati.

Cordiali saluti.

@include( 'emails.firmamessaggioamministrazione')
@endcomponent
