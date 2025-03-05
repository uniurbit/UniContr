<?php

namespace App\Console\Commands;


use Illuminate\Console\Command;
use App\PrecontrattualePerGenerazione;
use Illuminate\Support\Facades\DB;


class CalculateIdSorgenteRinnovo extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'calculate:id_sorgente_rinnovo';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Calculate and set the id_sorgente_rinnovo for each precontr with matching insegnamento, previous year, and user';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Start a transaction to ensure data integrity
        DB::beginTransaction();

        try {             
            // Set all id_sorgente_rinnovo values to null where stato is greater than or equal to 2
            // Get all precontr records where id_sorgente_rinnovo is null, and process in chunks for performance
            PrecontrattualePerGenerazione::with(['insegnamento'])->whereNull('id_sorgente_rinnovo')
                ->whereHas('insegnamento', function ($query) {
                    // Filter insegnamento records where aa is greater than 2016
                    $query->where('aa', '>', 2016)->where('motivo_atto','CONF_INC');
                })
                ->where('stato', '<', 2)
                ->chunk(100, function ($precontrs) {
                    foreach ($precontrs as $precontr) {
                        // Calculate the previous academic year (aa - 1)
                        $previousYear = $precontr->insegnamento->aa - 1;

                        // Find matching precontr from the previous year with the same insegnamento and user
                        $matchingPrecontrs = PrecontrattualePerGenerazione::whereHas('insegnamento', function ($query) use ($previousYear, $precontr) {
                                                // Apply conditions on the 'insegnamento' relationship
                                                $query->where('aa', $previousYear)
                                                        ->where('insegnamento', $precontr->insegnamento->insegnamento); // Matching insegnamento
                                            })
                                            ->where('docente_id', $precontr->docente_id) // Assuming docente_id is the identifier for the user
                                            ->where('stato', '<', 2) // Assuming stato should be less than 2
                                            ->get(); // Retrieve all matching records

                        // Check if exactly one matching record is found
                        if ($matchingPrecontrs->count() === 1) {
                            $previousPrecontr = $matchingPrecontrs->first();

                            if ($previousPrecontr->isCompleteChain()) {
                                // Check if id_sorgente_rinnovo is unique: se è già stato utilizzato
                                $existingPrecontr = PrecontrattualePerGenerazione::withoutGlobalScopes()->where('id_sorgente_rinnovo', $previousPrecontr->id)                                
                                    ->where('id', '!=', $precontr->id)
                                    ->where('stato', '<', 2)
                                    ->count();

                                if ($existingPrecontr === 0) {      
                                    //andrebbe controllato se il previusPrecontr appartiene ad una catena completa cioè la roor è un BANC_INC                          
                                    $precontr->id_sorgente_rinnovo = $previousPrecontr->id;
                                    $precontr->save();

                                    $previousPrecontr->sorgente_rinnovo_per_id = $precontr->id;
                                    $previousPrecontr->save();
                                    
                                    $this->info('Updated precontr ID: ' . $precontr->id . ' with id_sorgente_rinnovo: ' . $previousPrecontr->id . ' and anno_elaborazione: ' . $precontr->insegnamento->aa);
                                } else {                                
                                    // PrecontrattualePerGenerazione::withoutGlobalScopes()->where('id_sorgente_rinnovo', $previousPrecontr->id)                                
                                    //     ->where('id', '!=', $precontr->id)
                                    //     ->where('stato', '<', 2)->update(['id_sorgente_rinnovo' => null]);

                                    // $precontr->id_sorgente_rinnovo = null;
                                    // $precontr->save();
                                    $this->warn('Duplicate id_sorgente_rinnovo detected for ID: ' . $previousPrecontr->id .' not set for precontr ID: ' . $precontr->id.' dipartimento: '.$precontr->insegnamento->dipartimento );
                                }
                            } else {
                                $this->warn('Chain is incomplete, root motivo_atto is not BAN_INC in fouded previusPrecontr ID: ' . $previousPrecontr->id .' not set for precontr ID: ' . $precontr->id.' dipartimento: '.$precontr->insegnamento->dipartimento );
                            }
                        } else {
                            if ($matchingPrecontrs->isEmpty()) {
                                $this->warn('No matching precontr found for ID: ' . $precontr->id. ' and anno_elaborazione: ' . $precontr->insegnamento->aa.' dipartimento: '.$precontr->insegnamento->dipartimento );
                            } else {
                                $this->warn('Multiple matching precontrs found for ID: ' . $precontr->id. ' and anno_elaborazione: ' . $precontr->insegnamento->aa.' dipartimento: '.$precontr->insegnamento->dipartimento );
                            }
                        }
                    }
                });

            // Commit the transaction
            DB::commit();

            $this->info('id_sorgente_rinnovo calculation complete.');
        } catch (\Exception $e) {
            // Rollback the transaction in case of an error
            DB::rollBack();

            // Log the error and show the message
            $this->error('Error calculating id_sorgente_rinnovo: ' . $e->getMessage());
        }
    }
}
