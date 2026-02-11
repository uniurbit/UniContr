<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


// Route::get('/logoutSaml', function () {      
//     Auth::logout();    
//     Session::save();

//     return redirect('saml2/logout'); 
// });

// Route::group([
//     'prefix' => config('saml2_settings.routesPrefix'),
//     'middleware' => config('saml2_settings.routesMiddleware'),
// ], function () {
//     Route::post('/acs', array(
//         'as' => 'saml_acs',
//         'uses' => 'Saml2AuthController@acs',
//     ));
// });


// https://unidem.uniurb.it/unidem/unicontr/unicontr/public/saml2/prod/metadata
//https://unidem-preprod.uniurb.it/unidem/unicontr/unicontr/public/saml2/preprod/metadata
// http://127.0.0.1/saml2/local/metadata
Route::group([
    'prefix' => config('saml2_settings.routesPrefix'),
    'middleware' => config('saml2_settings.routesMiddleware'),
], function () {
    Route::get('metadata', function(Request $request){ 
        $url = URL::route('saml2_metadata', env('IDP_ENV_ID', 'local'));
        return redirect($url);
    });
    
});