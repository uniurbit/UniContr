<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('p1_insegnamento', function (Blueprint $table) {
            $table->string('part_stu_des')->nullable();  
            $table->string('part_stu_cod')->nullable();        
        });   
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('p1_insegnamento', function (Blueprint $table) {
            $table->dropColumn('part_stu_des');
            $table->dropColumn('part_stu_cod');          
        });
    }
};
