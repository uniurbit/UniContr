<?php

namespace App\Service;

use Illuminate\Support\Facades\Http;
use App;

class ApiService
{
    protected $apiUrl;
    protected $apiKey;
    protected $serviceName;

    public function __construct($serviceName)
    {
        $this->serviceName = $serviceName; // Set the service name dynamically

        //||App::environment('testing')
        if (App::environment('local')) {
            // Set the API URL and API key
            $this->apiUrl = env('API_URL') . '/';
            $this->apiKey = env('API_KEY_' . strtoupper($this->serviceName));
        }else{
              // Set the API URL and API key
            $this->apiUrl = env('API_URL') . '/' . $this->serviceName . '/' . $this->serviceName . '/public';
            $this->apiKey = env('API_KEY_' . strtoupper($this->serviceName));
        }

    }

    //ENDPOINT PER CONVENZIONE DOPO PUBLIC /api/v1/{apiname}
    public function callApi($userIdAb, $endpoint, $method = 'GET', $data = [])
    {
        // Check for missing API_URL and API_KEY
        if (!$this->apiUrl) {
            throw new \Exception('System not configured: API_URL is missing');
        }
        // Check if API_KEY is missing
        if (!$this->apiKey) {
            throw new \Exception('System not configured: API_KEY_' . strtoupper($this->serviceName) . ' is missing');
        }

        // Prepare headers
        $headers = [
            'X-API-Key' => $this->getApiKeyWithUserId($userIdAb), // Include user_id_ab in the API key
            'Content-Type' => 'application/json',
        ];
       
        // Construct the full URL
        $url = rtrim($this->apiUrl, '/') . '/' . ltrim($endpoint, '/'); // Combine API URL and endpoint

        // Make the API request based on the specified method
        $response = Http::withHeaders($headers)->$method($url, $data);

        // Handle response
        if ($response->failed()) {
            // Log the error or throw an exception
            throw new \Exception('API call failed: ' . $response->body());        
        }

        return $response->json();
    }

    /**
     *
     *  Get the API Key with user_id_ab appended.
     *
     * @param string|null $userIdAb
     * @return string
     */
    protected function getApiKeyWithUserId($userIdAb = null)
    {
        // Return the API key concatenated with user_id_ab if provided
        return $userIdAb ? $this->apiKey . ':' . $userIdAb : $this->apiKey;
    }
}
