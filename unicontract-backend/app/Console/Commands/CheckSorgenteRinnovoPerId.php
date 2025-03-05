<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Precontrattuale;

class CheckSorgenteRinnovoPerId extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:sorgente-rinnovo';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check if sorgente_rinnovo_per_id is correctly set for precontrattuali with id_sorgente_rinnovo';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Fetch all records where id_sorgente_rinnovo is not null
        $precontrs = Precontrattuale::whereNotNull('id_sorgente_rinnovo')->get();

        // Initialize counter for inconsistencies
        $inconsistentCount = 0;

        // Iterate through records
        foreach ($precontrs as $precontr) {
            if ($precontr->id == 6539){
                $this->warn("Inconsistent Record Found:");
            }
         
            $sorgente = $precontr->sorgenteRinnovo()->first();

            // Check if sorgente_rinnovo_per_id matches
            if ($sorgente->sorgente_rinnovo_per_id !== ($precontr->id ?? null)) {
                $inconsistentCount++;
                $this->warn("Inconsistent Record Found:");
                $this->line("Precontrattuale ID: {$sorgente->id}");
                $this->line("Expected sorgente_rinnovo_per_id: " . ($precontr->id ?? 'null'));
                $this->line("Found sorgente_rinnovo_per_id: {$sorgente->sorgente_rinnovo_per_id}");
                $this->line("-------------------------------");
                // Update the record with the correct sorgente_rinnovo_per_id value
                $sorgente->sorgente_rinnovo_per_id = $precontr->id;
                $sorgente->save();
                $this->info("Updated sorgente_rinnovo_per_id for Precontrattuale ID: {$sorgente->id}.");
            }
        }

       
          // Summary of inconsistencies
        if ($inconsistentCount === 0) {
            $this->info("All records are consistent!");
        } else {
            $this->error("Found and corrected {$inconsistentCount} inconsistent records.");
        }

        return Command::SUCCESS;
    }
}
