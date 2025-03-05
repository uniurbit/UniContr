<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;
use Storage;

class GenerateApiKey extends Command
{
    // The name and signature of the console command.
    protected $signature = 'generate:apikey';

    // The console command description.
    protected $description = 'Generate a new API key and store it in the .env file';

    // Execute the console command.
    public function handle()
    {
        // Generate a secure random API key
        $apiKey = Str::random(32); // Generates a random 32 character string

        // Load the existing .env file
        $envPath = base_path('.env');

        // Check if the .env file exists
        if (!file_exists($envPath)) {
            $this->error('.env file does not exist.');
            return;
        }

        // Read the contents of the .env file
        $envContents = file_get_contents($envPath);

        // Define the API key variable name
        $apiKeyVariable = 'API_KEY=';
        
        preg_match('/^API_KEY=(.*)$/m', $envContents, $matches);
        if (isset($matches[1])) {
            $oldApiKey = $matches[1];
            $this->info("Backing up the old API key: {$oldApiKey}");
            // Save the old key to a backup log (or you could write to a backup file)
            Storage::disk('local')->append('apikey-backup.log', 'Old API Key: ' . $oldApiKey . ' - ' . now());
        }

        // Check if the API key already exists in the .env file
        if (strpos($envContents, $apiKeyVariable) !== false) {
            // If it exists, update it
            $envContents = preg_replace('/API_KEY=.*/', $apiKeyVariable . $apiKey, $envContents);
        } else {
            // If it doesn't exist, append it to the .env file
            $envContents .= PHP_EOL . $apiKeyVariable . $apiKey;
        }

        // Write the updated contents back to the .env file
        file_put_contents($envPath, $envContents);

        // Output the newly generated API key
        $this->info('New API key generated and stored in .env: ' . $apiKey);
    }
}
