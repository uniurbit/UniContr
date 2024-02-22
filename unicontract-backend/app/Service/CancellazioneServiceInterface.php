<?php

namespace App\Service;

interface CancellazioneServiceInterface
{    
    /**
     * cancellazioneIstanza
     *
     * @param  int $id
     * @return void
     */
    public function cancellazioneIstanza($id, $pre);
}
