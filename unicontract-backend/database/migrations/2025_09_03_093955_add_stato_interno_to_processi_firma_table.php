<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('processi_firma', function (Blueprint $table) {
            $table->string('stato_interno')->nullable()->after('stato')
                  ->comment('Stato interno dell’applicazione (uploading, uploaded, retrying, ecc.)');
        });
    }

    public function down(): void
    {
        Schema::table('processi_firma', function (Blueprint $table) {
            $table->dropColumn('stato_interno');
        });
    }
};
