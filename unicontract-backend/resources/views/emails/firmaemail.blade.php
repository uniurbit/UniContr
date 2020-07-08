@component('mail::message')
Alla Segreteria del Magnifico Rettore<br>
<br>
Si informa che {{ $pre->user->nameTutorString() }} ha preso visione e accettato il contratto di Insegnamento<br>
di {{ $pre->insegnamento->insegnamentoDescr }} (anno accademico {{$pre->aa}})<br>
presso il {{ $pre->insegnamento->dipartimento }}.<br>
<br>
<br>
Pertanto, il contratto è pronto per la firma digitale, da apporre collegandosi ad
[UniContr]({{$urlUniContr}}).
<br>
@component('mail::button', ['url' => $urlUniContr])
Firma
@endcomponent

<br>
{{ $pre->user->nameTutorString() }} <br>
{{ $pre->user->email }}
@endcomponent
