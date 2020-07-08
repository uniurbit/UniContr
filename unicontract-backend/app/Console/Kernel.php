<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use App\Console\Commands\SearchDataTitulusSendEmails;
use App\Console\Commands\SendReportEmails;
use App\Console\Commands\SendSollecitoEmails;
use App\Console\Commands\BackupDatabase;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        Commands\SearchDataTitulusSendEmails::class, 
        Commands\SendReportEmails::class,        
        Commands\SendSollecitoEmails::class,
        Commands\BackupDatabase::class
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {        
        //Europe/Rome
        $schedule->command(SearchDataTitulusSendEmails::class, [])->timezone('Europe/Rome')->dailyAt('14:00');
        $schedule->command(SendReportEmails::class, [])->timezone('Europe/Rome')->monthlyOn(10,'8:00');
        $schedule->command(SendSollecitoEmails::class, [])->timezone('Europe/Rome')->monthlyOn(10,'8:00');
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
