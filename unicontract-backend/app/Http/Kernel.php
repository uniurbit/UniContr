<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array
     */
    protected $middleware = [
        \Illuminate\Foundation\Http\Middleware\CheckForMaintenanceMode::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \App\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
        \App\Http\Middleware\TrustProxies::class,
        \App\Http\Middleware\Cors::class,
        \App\Http\Middleware\LogRequest::class
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            // \Illuminate\Session\Middleware\AuthenticateSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            
            \Illuminate\Routing\Middleware\SubstituteBindings::class,            
        ],

        'api' => [
            'throttle:60,1',
            'bindings',
        ],
        'saml' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
        ],
    ];

    /**
     * The application's route middleware.
     *
     * These middleware may be assigned to groups or used individually.
     *
     * @var array
     */
    protected $routeMiddleware = [
        'auth' => \Illuminate\Auth\Middleware\Authenticate::class,
        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'check' => \App\Http\Middleware\CheckBlocked::class,
        'bindings' => \Illuminate\Routing\Middleware\SubstituteBindings::class,
        'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'signed' => \Illuminate\Routing\Middleware\ValidateSignature::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'isAdmin' => \App\Http\Middleware\AdminMiddleware::class,
        'csrf' => \App\Http\Middleware\VerifyCsrfToken::class,
        'log' => \App\Http\Middleware\LogAfterRequest::class,
        /*saml*/
        'samlauth' => \App\Http\Middleware\SamlAuth::class,
        'cors' => \App\Http\Middleware\Cors::class,
        'api.version' => \App\Http\Middleware\APIversion::class,
        'auth.jwt' => \Tymon\JWTAuth\Http\Middleware\Authenticate::class,
        'role' => \Spatie\Permission\Middlewares\RoleMiddleware::class,
        'storeudate' => \App\Http\Middleware\StoreUdatePrecontrattuale::class,

        'ownermiddleware' => \App\Http\Middleware\OwnerMiddleware::class,
        'auth.api_or_apikey' => \App\Http\Middleware\AuthApiOrApiKey::class,
    ];
}
