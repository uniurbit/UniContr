<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\StoryProcess;
use App\Models\Precontrattuale;
use App\Precontrattuale as Precontr;
use Illuminate\Support\Facades\Auth;
use App\Service\PrecontrattualeService;

class StoryProcessController extends Controller
{

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $story = [];
        $message = '';
       
            $queryBuilder = StoryProcess::leftJoin('users', function($join) {
                $join->on('users.id', '=', 'table_story_process.user_id');
            })->orderBy('table_story_process.created_at', 'DESC')
            ->where('insegn_id', $id);
            $story = $queryBuilder->get(['users.name', 'table_story_process.descrizione', 'table_story_process.created_at', 'table_story_process.user_id']);
            $success = true;
      
        return compact('story', 'message', 'success');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $story = [];
        $message = '';
      
            $dati = new StoryProcess();
            $postData = $request->except('id', '_method');
            
            $precontr = Precontr::where('insegn_id', $request->insegn_id)->first();

            $dati->fill($postData);
            $dati->user_id = Auth::user()->id;

            $success = $precontr->storyprocess()->save($dati);             
            
            $story = $dati;
        
        return compact('story', 'message', 'success');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $datiPrecontrattuale = [];
        $message = '';

            $datiPrecontrattuale = PrecontrattualeService::getDatiIntestazione($id);

            $queryBuilder = StoryProcess::leftJoin('users', function($join) {
                $join->on('users.id', '=', 'table_story_process.user_id');
            })->orderBy('table_story_process.created_at', 'DESC')
            ->where('insegn_id', $id);

            $datiPrecontrattuale['story'] = $queryBuilder->get(['users.name', 'table_story_process.descrizione', 'table_story_process.created_at', 'table_story_process.user_id']);

            $success = true;
       
        return compact('datiPrecontrattuale', 'message', 'success');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
