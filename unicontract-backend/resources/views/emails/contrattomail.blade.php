@component('mail::message')
Gentile {{ $pre->user->nameTutorString() }},

con riferimento all'incarico di insegnamento di<br>
{{ $pre->insegnamento->insegnamentoDescr }} (anno accademico {{$pre->aa}})<br>
presso il {{ $pre->insegnamento->dipartimento }}<br>
dell'Università degli Studi di Urbino Carlo Bo,<br>
<br>
Le inviamo, in allegato, il contratto sottoscritto digitalmente dal Magnifico Rettore.<br>            

Cordiali saluti.<br>
Università degli Studi di Urbino Carlo Bo<br>
@endcomponent
