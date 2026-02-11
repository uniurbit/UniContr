@component('mail::message')
All'Ufficio Amministrazione e Reclutamento Personale Docente<br>
All'Ufficio Trattamenti Economici e Previdenziali<br>
<br>
Si informa che {{ $pre->user->nameTutorString() }} ha compilato la modulistica precontrattuale relativa al<br>
contratto di insegnamento di {{ $pre->insegnamento->insegnamentoDescr }}<br>
per l'anno accademico {{$pre->aa}} presso il {{ $pre->insegnamento->dipartimento }}.<br>
<br>
La modulistica compilata è accessibile da [UniContr]({{$urlUniContr}})<br>
ed è in attesa di verifica e validazione da parte vostra.<br>

@component('mail::button', ['url' => $urlUniContr])
Modulistica 
@endcomponent

<br>
{{ $pre->user->nameTutorString() }} <br>
{{ $pre->user->email }}
@endcomponent
