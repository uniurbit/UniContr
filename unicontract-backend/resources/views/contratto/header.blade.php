<!DOCTYPE html>
<html><head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>	
<script>
     /*<![CDATA[*/
    function subst() {        
        var vars={};        
        var x=window.location.search.substring(1).split('&');
        for (var i in x) {
            var z=x[i].split('=',2);
            vars[z[0]] = unescape(z[1]);
        }
        if(vars.page > 1){ // If page > 1, set FakeHeaders display to none
            document.getElementById('faker').style.display = 'none';
        }
        document.getElementById('page').innerHTML = vars.page;
    }
    /*]]>*/
</script>
<style type="text/css">
    body 
    {
        border:0; 
        margin: 0;
        padding: 0;   
        height: 151px;                  
    }

    #master-div
    {        
        overflow: hidden;
        height: 100%;
    }
    
    .logo {
      float: left;           
      height: 120px;    
      position: absolute;               
      top: 0;
      /* background-image: url("/img/logo_uniurb.png"); */
      
    }

</style>
</head>
<body onload="subst()">
 
    <div id="master-div">       
        {{-- <img src="file:///{{public_path('/img/logo_uniurb.png')}}" class="logo" />    --}}
        <img id="faker" src="file:///{{public_path('img\\logo_uniurb.png')}}" class="logo" />         
    </div>

    {{-- <script  type="text/javascript"> 
        console.log('inizio');
        var vars={};
        console.log(window.location);
        var x=window.location.search.substring(1).split('&');
        for (var i in x) {
            var z=x[i].split('=',2);
            vars[z[0]] = unescape(z[1]);
        }
        document.getElementById('page').innerHTML = vars.page; 
        document.getElementById('topage').innerHTML = vars.topage; 
    </script>   --}}

 <!-- <script type="text/javascript">
    function subst() {
        var vars = {};
        var query_strings_from_url = document.location.search.substring(1).split('&');
        for (var query_string in query_strings_from_url) {
            if (query_strings_from_url.hasOwnProperty(query_string)) {
                var temp_var = query_strings_from_url[query_string].split('=', 2);
                vars[temp_var[0]] = decodeURI(temp_var[1]);
            }
        }
        var css_selector_classes = ['page', 'frompage', 'topage', 'webpage', 'section', 'subsection', 'date', 'isodate', 'time', 'title', 'doctitle', 'sitepage', 'sitepages'];
        for (var css_class in css_selector_classes) {
            if (css_selector_classes.hasOwnProperty(css_class)) {
                var element = document.getElementsByClassName(css_selector_classes[css_class]);
                for (var j = 0; j < element.length; ++j) {
                    element[j].textContent = vars[css_selector_classes[css_class]];
                }
            }
        }
    }
    </script>  -->
</body>
</html>
