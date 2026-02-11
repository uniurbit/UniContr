<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

//use Symfony\Component\Debug\Exception\FlattenException;
//use Symfony\Component\Debug\ExceptionHandler as SymfonyExceptionHandler;
use App\Mail\ExceptionOccured as ExceptionMail;
use Yajra\Pdo\Oci8\Exceptions\Oci8Exception;
use Throwable;

use Symfony\Component\ErrorHandler\ErrorRenderer\HtmlErrorRenderer;
use Symfony\Component\ErrorHandler\Exception\FlattenException;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'password',
        'password_confirmation',
    ];

    /**
     * Report or log an exception.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Throwable $exception)
    {
        if ($this->shouldReport($exception)) {
            $this->sendExceptionEmail($exception);
        }
               
        Log::error($exception);
        parent::report($exception);
    }


     /**
     * Parse the exception and send email
     *
     * @param Exception $exception
     */
    public function sendExceptionEmail(Throwable $exception)
    {
        try {

            // Use 'Exception' for compatibility with FlattenException.
            $exceptionToSend = $exception instanceof Exception ? $exception : new Exception($exception->getMessage(), $exception->getCode(), $exception);

            $e = FlattenException::create($exceptionToSend);
            $handler = new HtmlErrorRenderer(true); // boolean, true raises debug flag...

            #$e = FlattenException::create($exception);
            #$handler = new SymfonyExceptionHandler();

            $html = $handler->getBody($e);
            $css = $handler->getStylesheet();

            Mail::queue(new ExceptionMail($html,$css));
        } catch (Throwable $e) {
            Log::error('Errore non inviato');
            Log::error($e);
        }
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response
     */
    public function render($request, Throwable $exception)
    {
        //message:"ORA-12170: TNS:Connect timeout occurred"
        if ($exception instanceof Oci8Exception){
            Log::error($exception);
            $response = response()->json(['message' => "Sottosistema Ugov in manutenzione"], 500);
            $response->setStatusCode(500, "Sottosistema Ugov in manutenzione");
            return $response;
        }

        return parent::render($request, $exception);
    }

   


}
