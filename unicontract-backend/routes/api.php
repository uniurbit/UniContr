<?php

use Illuminate\Http\Request;
use Aacotroneo\Saml2\Saml2Auth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// App v1 API
Route::group([
    'middleware' => ['api', 'api.version:1'],  
    'prefix'     => 'v1',
  ], function ($router) {
    require base_path('routes/app_api.v1.php');
});
  
  
Route::get('loginSaml', function(Request $request){    
    if(\Auth::guest())
    {
        $redirect = $request->query('redirect'); 
        $referrer = $request->query('referrer');   
        if ($referrer){
            Log::info('referrer: '.$referrer);
            $url = parse_url($referrer);
            if ($url){
                if (isset($url['host'])){
                    Log::info('host: '.$url['host']);                 
                    $clientUrl = parse_url(config('unidem.client_url'));
                    if ($url['host'] !== 'www.uniurb.it' && $url['host'] != $clientUrl['host']){
                        Log::info('redirect: https://www.uniurb.it/');                 
                        return redirect()->away('https://www.uniurb.it/');
                    }                    
                }
                if (isset($url['query'])){
                    Log::info('query: '.$url['query']);            
                }                               
            }                       
        }                               
        $saml2Auth = new Saml2Auth(Saml2Auth::loadOneLoginAuthFromIpdConfig( env('IDP_ENV_ID', 'local')));
        return $saml2Auth->login($redirect ? $redirect : 'home');
    }
});

Route::group([
    'middleware' => ['api','cors'],
    'prefix' => 'auth',
    'namespace'=>'Api'
], function ($router) {   
    Route::post('refreshtoken', 'AuthController@refresh');
    Route::get('logout', 'AuthController@logout');         
});

Route::group([
    'middleware' => ['cors','auth:api','log','role:super-admin'],
    'prefix' => 'auth',
    'namespace'=>'Api'
], function ($router) {
    Route::post('cambiautente', 'AuthController@cambiautente'); 
});