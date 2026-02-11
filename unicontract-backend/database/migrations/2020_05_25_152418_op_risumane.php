<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\MappingRuolo;
use App\Role;
use App\Personale;
use Illuminate\Support\Facades\DB;

class OpRisumane extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $role = Role::where('name','op_risumane')->first();
        if ($role==null){
            $role = Role::create(['name' => 'op_risumane']);
            $this->insertOffice(['005145'], 'op_risumane');
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }

    private function insertOffice(Array $offices, $rolename){
        $role = Role::where('name', $rolename)->first();
        foreach ($offices as $office) {
            $mp = new MappingRuolo();
            $mp->unitaorganizzativa_uo = $office;
            // Only try to read from Oracle in non-testing environments
            if (!app()->environment('testing')) {
                $uo = $mp->unitaorganizzativa()->get()->first();
                if ($uo) {
                    $mp->descrizione_uo = $uo->descr;
                    $mp->role_id = $role->id;
                    $mp->save();
                }
            } else {
                // Fake description for testing/CI
                $mp->descrizione_uo = "Fake descr for $office";
                $mp->role_id = $role->id;
                $mp->save();
            } 
        }       
    }

    
    /**
     * Check if Oracle connection is alive
     */
    private function oracleConnected(): bool
    {
        try {
            DB::connection('oracle')->getPdo();
            return true;
        } catch (\Exception $e) {
            // Could not connect
            return false;
        }
    }
}
