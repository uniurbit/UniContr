<!DOCTYPE html>
<html><head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>	

<style type="text/css">
    html, body, p, ul, li, span, img {
        margin: 0px;      
        padding: 0px;
    }

    body {        
        font-family: Arial, Helvetica, sans-serif;
        font-size: 12pt;
        line-height: 1.7;		                                  
        text-rendering: geometricPrecision;
    } 

    h2, h3, h4 { line-height: 100% }

    th { 
       font-size: 10pt;
       text-rendering: geometricPrecision;
       padding-bottom:10px;
    }

    td {
        padding-bottom:10px;    
    }

    
    div.page {
        page-break-after: always;
        page-break-inside: avoid;
    } 

    .normal {
        font-family:  Arial, Helvetica, sans-serif;
        font-size: 9pt;		
        text-rendering: geometricPrecision;
        line-height: 1.7;
        text-align: justify
    }

</style>
</head>

<body>

@if ($grouped->count()>0)
<hr>
<h3>{{ __('global.'.$dip) }}</h3>
Data del documento: {{ Carbon\Carbon::now()->format(config('unidem.date_format_contratto'))}}
<hr>
<h2 style="padding-top: 10px;">ELENCO CONTRATTI DI DOCENZA NON ANCORA STIPULATI</h2>
@foreach($grouped as $pres)

<!-- <div class="page"> -->
    <h3 style="padding-top: 10px;">A.A. {{$pres->first()->aa}}</h3>
    <table cellspacing="0" border="0" width="100%" style="padding-top: 10px;">
        <thead>    
            <tr>
                <th style="width: 5%;">PROGR.</th>
                <th style="width: 13%;text-align: left;">NOMINATIVO</th>
                <th style="width: 39%;text-align: left;">INSEGNAMENTO</th>
                <th style="width: 7%; ">A.A.</th>
                <th style="width: 7%; ">DAL GIORNO</th>
                <th style="width: 7%; ">AL GIORNO</th>
                <th style="width: 7%; ">CONFERIMENTO</th>
                <th style="width: 6%; ">GG. DAL CONF.</th>
                <th style="width: 9%; ">STATO</th>
            </tr>
        </thead>
        <tbody>           
            @foreach($pres as $pre)
            <tr>
                <td style="width: 5%; text-align: center;">{{$loop->iteration}}</td>
                <td style="width: 13%">{{$pre->user->nameTutorString()}}</td>
                <td style="width: 39%">{{$pre->insegnamentoDescr}}</td>
                <td style="width: 7%; text-align: center;">{{$pre->aa}}</td>                
                <td style="width: 7%; text-align: center;">{{$pre->insegnamento->dataInizioPeriodo()}}</td>                
                <td style="width: 7%; text-align: center;">{{$pre->insegnamento->dataFinePeriodo()}}</td>
                <td style="width: 7%; text-align: center;">{{$pre->insegnamento->dataDelibera()}}</td>
                <td style="width: 6%; text-align: center;">{{ $pre->insegnamento->giorniDeliberaAOggi() }}</td>
                <td style="width: 9%; text-align: center;">  {!!nl2br(e($pre->currentStateReport()))!!}</td>
            </tr>
            @endforeach
        </tbody>
    </table>    
<!-- </div> -->
@endforeach

@endif
</body>
</html>
