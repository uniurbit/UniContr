<?php

namespace App;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;
use App\Observers\UserActionsObserver;
use Illuminate\Support\Str;
use Carbon\Carbon;
use App\Models\AnagraficaUgov;
use App\UnitaOrganizzativa;
use Auth;
use App;
class User extends Authenticatable implements JWTSubject
{
    use Notifiable;
    use HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id','name', 'email', 'password', 'v_ie_ru_personale_id_ab', 'blocked_date',
        'cf',
        'nome',
        'cognome'      
    ];

    protected $casts = [
        'blocked_date' => 'datetime:d-m-Y',        
    ];

    protected $appends = ['listaruoli'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public static function boot()
    {
        parent::boot();
        
        User::observe(new UserActionsObserver);
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {        
        $dips = [];
        if (!$this->hasPermissionTo('search all contratti')){         
            $uo = $this->unitaorganizzativa();
            if ($uo){
                if ($uo->isPlesso()){
                    $dips  = $uo->dipartimenti();
                }else if ($uo->isDipartimento()){
                    $dips = [$uo->uo];
                }
            }
        }else{
            $dips = UnitaOrganizzativa::allDipartimenti();
        }

        return [
            'id'              => $this->id,
            'name'            => $this->name,
            'email'           => $this->email,
            'dips'            => $dips,  
            'roles'           => $this->roles()->pluck('name')->map(function ($value) {
                                    return Str::upper($value);
                                }),
        ];
    }

    public function getIntendedUrl(){
        if (App::environment('local')) {
            return config('unidem.client_url'); //'http://localhost:4200';
        }
        return config('unidem.client_url');      
    }
    

 /**
     * Set attribute to date format
     * @param $input
     */
    public function setBlockedDateAttribute($input)
    {
        if($input != '') {
            $this->attributes['blocked_date'] = Carbon::createFromFormat(config('unidem.date_format'), $input)->format('Y-m-d');
        }else{
            $this->attributes['blocked_date'] = null;
        }
    }

    /**
     * Get attribute from date format
     * @param $input
     *
     * @return string
     */
    public function getBlockedDateAttribute($input)
    {
        if($input != null && $input != '00-00-0000') {
            return Carbon::createFromFormat('Y-m-d', $input)->format(config('unidem.date_format'));
        }else{
            return null;
        }
    }



    /**
     * Route notifications for the mail channel.
     *
     * @param  \Illuminate\Notifications\Notification  $notification
     * @return string
     */
    public function routeNotificationForMail($notification)
    {
        return $this->email;
    }

    //Relazione: la tabella collegata in cui è espressa l'unità organizzativa e il relativo responsabile 
    public function personaleRespons()
    {
        return $this->hasOne(PersonaleResponsOrg::class, 'id_ab', 'v_ie_ru_personale_id_ab');
    }

    public function personale()
    {
        return $this->hasOne(Personale::class, 'id_ab', 'v_ie_ru_personale_id_ab');
    }

    public function anagraficaugov()
    {
        return $this->hasOne(AnagraficaUgov::class, 'id_ab', 'v_ie_ru_personale_id_ab');
    }

    public function codice_unitaorganizzativa()
    {
        return $this->personaleRespons()->first()->cd_csa;                                    
    }

    public function unitaOrganizzativa()
    {
        $p = $this->personale()->first();
        if ($p){
            return $p->unita()->first();                
        }        
    }
 
    /**
     * responsabile: restituisce il responsabile dell'utente corrente
     *
     * @return Personale
     */
    public function responsabile(){
        $pers =  $this->personaleRespons()->first(); 
        if ($pers)
            return $pers->responsabile()->first();        
    }


     /**
     * Get the attachments relation morphed to the current model class
     *
     * @return MorphMany
     */
    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'model')->AttachmentType();
    }


    public function nameTutorString(){
        return ucwords(mb_strtolower($this->nome, 'UTF-8'))." ".ucwords(mb_strtolower($this->cognome, 'UTF-8'));
    }

    
    public function getListaruoliAttribute(){

        if ($this->roles == null || $this->roles->count() == 0){
            return "Nessun ruolo";
        }else{                        
            return $this->roles->implode('name',', ');            
        }        
    }

}
