<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use JWTAuth;
use App\User;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login','refresh']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth()->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        try {
            auth()->logout();
            return response()->json([
              'status' => 'success',
              'msg' => 'Logged out effettuato con successo'
            ]);
          } catch (JWTException $e) {
              JWTAuth::unsetToken();
              // something went wrong tries to validate a invalid token
              return response()->json([
                'status' => 'error',
                'msg' => 'Logout fallito.'
            ]);
          }
        
        return response()->json(['message' => 'Logged out effettuato con successo']);
    }

    public function cambiautente(Request $request)
    {  
        // if (!App::environment(['local','preprod'])) { 
        //     $data = [];
        //     $message = 'Operazione non eseguibile: operatore non abilitato';
        //     $success = false;
        //     return compact('data', 'message', 'success');   
        // }

        if (!Auth::user()->hasRole('super-admin')){
            $data = [];
            $message = 'Operazione non eseguibile: operatore non abilitato';
            $success = false;
            return compact('data', 'message', 'success');   
        }

        $user = User::find($request->id);
        if ($user) {
            $success=true;
            Auth::login($user);
            $token = JWTAuth::fromUser($user);
            return response()->json(compact('token','success'));
        }
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh(Request $request)
    {  
        //$new_token  = JWTAuth::refresh($request->token);
        //$token = $this->jwtAuth->getToken();
        //$token = auth()->refresh();

        $token = JWTAuth::getToken();

        if (! $token) {
            throw new BadRequestHttpException('Token not provided');
        }

        //try {
        $token = auth()->refresh();
        //$token = JWTAuth::refresh($request->refreshToken);
        //} catch (TokenInvalidException $e) {
        //    throw new AccessDeniedHttpException('The token is invalid');
        //}

        return response()->json(compact('token'));
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60
        ]);
    }
}