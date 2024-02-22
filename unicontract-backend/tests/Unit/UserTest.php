<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;
use App\Role;
use App\User;
use App\Permission;
use JWTAuth;
use Faker\Generator as Faker;
use App\Notifications\NotificaDocente;
use Illuminate\Support\Facades\Notification;
use Illuminate\Notifications\AnonymousNotifiable;

class UserTest extends TestCase
{
    use WithoutMiddleware;

    //./vendor/bin/phpunit  --testsuite Unit --filter testApiRoles_All
    public function testApiRoles_All(){
        $user = User::where('email','test.admin@uniurb.it')->first();
        $token = JWTAuth::fromUser( $user);
        $headers = ['Authorization' => "Bearer $token"];

        //lista ruoli
        $response = $this->json('GET', 'api/v1/users/roles', [], $headers)
            ->assertStatus(200);  
            
        echo($response->getContent());
    }

     //./vendor/bin/phpunit  --testsuite Unit --filter testApiPermssions_All
     public function testApiPermssions_All(){
        $user = User::where('email','test.admin@uniurb.it')->first();
        $token = JWTAuth::fromUser( $user);
        $headers = ['Authorization' => "Bearer $token"];

        //lista ruoli
        $response = $this->json('GET', 'api/v1/users/permissions', [], $headers)
            ->assertStatus(200);  
            
        echo($response->getContent());
    }

    //./vendor/bin/phpunit  --testsuite Unit --filter testApiRoles
    public function testApiRoles(){
        $user = User::where('email','test.admin@uniurb.it')->first();
        $token = JWTAuth::fromUser( $user);
        $headers = ['Authorization' => "Bearer $token"];

        //lista ruoli
        $response = $this->json('GET', 'api/v1/roles', [], $headers)
            ->assertStatus(200);        
        

        //cancella
        $r = Role::where('name','super-super-test')->first();
        if ($r){
            $response = $this->json('DELETE', 'api/v1/roles/'.$r->id, [], $headers)
                ->assertStatus(200);
        }
        
        //crea         
        $role = Role::factory()->make();
        $data = $role->toArray();        
        $data['permissions'] = \App\Permission::all()->take(2);

        $response = $this->json('POST', 'api/v1/roles', $data, $headers)
            ->assertStatus(201)
            ->assertJson([
                'name' => $role->name,
                'permissions' => [ [ 'name' => $data['permissions'][0]['name'] ] ]
            ]);            
        
        //aggiorna
        $data['id'] = $response->original->id;
        $data['permissions']->shift();
        $response = $this->json('PUT', 'api/v1/roles/'.$data['id'], $data, $headers)
            ->assertStatus(200)
            ->assertJson([
                'name' => $role->name,
                'permissions' => [ [ 'name' => $data['permissions'][0]['name'] ] ]
            ]);   

        //echo($response->getContent()); 
        
        //cancella
        $response = $this->json('DELETE', 'api/v1/roles/'.$data['id'], $data, $headers)
            ->assertStatus(200);

        echo($response->getContent());
    }

   //./vendor/bin/phpunit  --testsuite Unit --filter testApiPermissions
    public function testApiPermissions(){
        $user = User::where('email','test.admin@uniurb.it')->first();
        $token = JWTAuth::fromUser( $user);
        $headers = ['Authorization' => "Bearer $token"];

        $response = $this->json('GET', 'api/v1/permissions', [], $headers)
            ->assertStatus(200)
            ->assertJson(
                [
                    ['name' => 'create contratti' ],
                    ['name' => 'update contratti' ]
                ] 
           );

        //precondizione
        $p = Permission::where('name','permission-test-test')-> first();
        if ($p)
           $p->delete();

        //crea
        $permission = Permission::factory()->make();
        $data = $permission->toArray();                
        
        //crea
        $response = $this->json('POST', 'api/v1/permissions', $data, $headers)
            ->assertStatus(201)
            ->assertJson([
                'name' => $permission->name,        
            ]);             
        echo($response->getContent());

        //aggiorna
        $data['id'] = $response->original->id;
        $data['name'] = 'test permission';
        $response = $this->json('PUT', 'api/v1/permissions/'.$data['id'], $data, $headers)
            ->assertStatus(200)
            ->assertJson([
                'name' =>  $data['name'],        
            ]);  
        echo($response->getContent());

        //cancella
        $response = $this->json('DELETE', 'api/v1/permissions/'.$data['id'], $data, $headers)
            ->assertStatus(200);
        echo($response->getContent());
    }

     //./vendor/bin/phpunit  --testsuite Unit --filter testReadEmailFromRespons
     public function testReadEmailFromRespons(){

        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);
 
        $email =  $user->responsabile()->email;
        
        $this->assertNotNull($email); 
     }

    //./vendor/bin/phpunit  --testsuite Unit --filter testSendEmail
    public function testSendEmail(){

        //otification::fake();

        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        $this->actingAs($user);

        $data= [
            'name' => 'Test Docente'
        ];
      
        try{
            Notification::route('mail', 'enrico.oliva@uniurb.it')->notify(new NotificaDocente($data));       
            $this->assertTrue(true); 

        } catch (\Exception $e) {
            throw $e;
        }
      
    }

    //./vendor/bin/phpunit  --testsuite Unit --filter testApiSendEmailAPI
    public function testApiSendEmailAPI(){

        $user = User::where('email','enrico.oliva@uniurb.it')->first();
        //$this->actingAs($user);
        $token = JWTAuth::fromUser( $user);
        $headers = ['Authorization' => "Bearer $token"];

        $data = [
            'email' => 'testdocente@uniurb.it',
            'name' => 'test docente',
        ];

        $response = $this->json('POST', 'api/v1/mail/sendMail', $data, $headers)
            ->assertStatus(200);

        $this->assertTrue($response->getData()->success);

    }

}