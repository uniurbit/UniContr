@component('mail::message')
All'Ufficio Stipendi<br>
<br>
Si informa che il contratto di insegnamento di {{ $pre->user->nameTutorString() }} per {{ $pre->insegnamento->insegnamentoDescr }}<br>
per l'anno accademico {{$pre->annoAccademico()}} presso il {{ $pre->insegnamento->dipartimento }} <br>
è stato validato dall'Ufficio Amministrazione e Reclutamento Personale Docente. <br>
<br>
La precontrattuale validata è accessibile da [UniContr]({{$urlUniContr}})<br>
ed è in attesa di verifica e validazione da parte vostra.<br>

@component('mail::button', ['url' => $urlUniContr])
Modulistica 
@endcomponent


<br>
@include( 'emails.firmamessaggioamministrazione')
@endcomponent
