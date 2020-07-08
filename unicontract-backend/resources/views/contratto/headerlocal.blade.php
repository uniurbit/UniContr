<!DOCTYPE html>
<html><head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>	
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
<body>
 
    <div id="master-div">       
        {{-- <img src="file:///{{public_path('/img/logo_uniurb.png')}}" class="logo" />    --}}
        <img id="faker" src="file:///{{public_path('img\\logo_uniurb.png')}}" class="logo" />         
    </div>
</body>
</html>
