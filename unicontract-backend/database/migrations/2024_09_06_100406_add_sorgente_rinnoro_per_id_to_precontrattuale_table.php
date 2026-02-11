<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\PrecontrattualePerGenerazione;

class AddSorgenteRinnoroPerIdToPrecontrattualeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('precontr', function (Blueprint $table) {
            // Add the sorgente_rinnovo_per_id  field with a foreign key relationship to self
            $table->unsignedInteger('sorgente_rinnovo_per_id')->nullable()->after('id_sorgente_rinnovo');

            // If you want to enforce foreign key constraint
            $table->foreign('sorgente_rinnovo_per_id')->references('id')->on('precontr')->onDelete('set null');
        });

        // Populate the sorgente_rinnovo_per_id  field based on current relations
        $this->populateSorgenteRinnoroPerId();
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('precontr', function (Blueprint $table) {
            $table->dropColumn('sorgente_rinnovo_per_id');
            $table->dropForeign(['sorgente_rinnovo_per_id']);
        });
    }

    /**
     * Function to populate sorgente_rinnovo_per_id 
     */
    protected function populateSorgenteRinnoroPerId()
    {
        // Fetch all Precontrattuali where id_sorgente_rinnovo is set
        $precontrattuali = PrecontrattualePerGenerazione::withoutGlobalScopes()->whereNotNull('id_sorgente_rinnovo')->get();

        foreach ($precontrattuali as $precontr) {
            // Update the record with the reverse reference
            PrecontrattualePerGenerazione::withoutGlobalScopes()->where('id', $precontr->id_sorgente_rinnovo)
                ->update(['sorgente_rinnovo_per_id' => $precontr->id]);
        }
    }
}
