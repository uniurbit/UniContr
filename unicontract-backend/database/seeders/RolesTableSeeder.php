<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Role;
use App\Permission;
//php artisan db:seed --class=RolesTableSeeder 
//php artisan migrate:fresh --seed
class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::create(['name' => 'create contratti']);
        Permission::create(['name' => 'update contratti']);
        Permission::create(['name' => 'delete contratti']);
        Permission::create(['name' => 'view contratti']);     
                        
        Permission::create(['name' => 'create attachments']);
        Permission::create(['name' => 'update attachments']);
        Permission::create(['name' => 'delete attachments']);
        Permission::create(['name' => 'view attachments']);        

        //permessi mappingruoli
        Permission::create(['name' => 'create mappingruoli']);
        Permission::create(['name' => 'update mappingruoli']);
        Permission::create(['name' => 'delete mappingruoli']);
        Permission::create(['name' => 'view mappingruoli']);          

        //permessi ricerche
        Permission::create(['name' => 'search all contratti']);  
        Permission::create(['name' => 'search orgunit contratti']);  

        Permission::create(['name' => 'search all insegnamenti']);  
        Permission::create(['name' => 'search orgunit insegnamenti']);  

        //permessi B1ConflittoInteressi
        Permission::create(['name' => 'generatepdf b1conflittointeressi']);        
        
        Permission::create(['name' => 'sending firstemail']);        
        Permission::create(['name' => 'sending infoemail']);        
        
        Permission::create(['name' => 'terminainoltra precontrattuale']);        
        Permission::create(['name' => 'validazioneamm precontrattuale']);  
        Permission::create(['name' => 'validazioneeconomica precontrattuale']); 
        Permission::create(['name' => 'annullaamm precontrattuale']);         
        Permission::create(['name' => 'annullaeconomica precontrattuale']);     
        Permission::create(['name' => 'presavisione precontrattuale']);     
        Permission::create(['name' => 'annullacontratto precontrattuale']);     
        Permission::create(['name' => 'rinuncia precontrattuale']);     
        
        Permission::create(['name' => 'compila precontrattuale']);   

        
        // create roles and assign created permissions
        $role = Role::create(['name' => 'op_docente']) 
            ->givePermissionTo(['view contratti', 
                'search orgunit contratti', 
                'search orgunit insegnamenti',
                'presavisione precontrattuale', 'view attachments', 'terminainoltra precontrattuale', 'compila precontrattuale']);

        // this can be done as separate statements
        $role = Role::create(['name' => 'viewer']);
        $role->givePermissionTo(['view contratti', 'view attachments', 'search orgunit contratti', 'search orgunit insegnamenti']);
             
        $role = Role::create(['name' => 'op_approvazione'])
            ->givePermissionTo(['search all contratti','search all insegnamenti','update contratti', 'sending infoemail', 'sending firstemail','view attachments']);

        $role = Role::create(['name' => 'op_approvazione_amm'])
            ->givePermissionTo(['search all contratti','search all insegnamenti','update contratti', 'validazioneamm precontrattuale', 
                'annullaamm precontrattuale', 'sending infoemail', 'sending firstemail','view attachments']);

        $role = Role::create(['name' => 'op_approvazione_economica'])
            ->givePermissionTo(['search all contratti','search all insegnamenti','update contratti', 'validazioneeconomica precontrattuale', 
                'annullaeconomica precontrattuale', 'sending infoemail', 'sending firstemail']);

        //super admin
        $role = Role::create(['name' => 'super-admin']);
        $role->givePermissionTo(Permission::all());        
       
        //amministratore
        $role = Role::create(['name' => 'admin']);
        $role->givePermissionTo(Permission::all());
        $role->revokePermissionTo('search all contratti');
        $role->revokePermissionTo('search all insegnamenti');
        
        $role = Role::create(['name' => 'limited']); 
        $role->givePermissionTo(['search orgunit contratti']);     
        $role->givePermissionTo(['search orgunit insegnamenti']); 

         //dipartimenti valutare creazione unico ruolo
        $role = Role::create(['name' => 'op_dipartimentale']);
        $role->givePermissionTo(Permission::all());        
        $role->revokePermissionTo('validazioneeconomica precontrattuale');
        $role->revokePermissionTo('validazioneamm precontrattuale');
        $role->revokePermissionTo('annullaamm precontrattuale');
        $role->revokePermissionTo('annullaeconomica precontrattuale');    
        $role->revokePermissionTo('search all contratti');
        $role->revokePermissionTo('search all insegnamenti');
        

        $this->command->info('created roles');

    }
}
