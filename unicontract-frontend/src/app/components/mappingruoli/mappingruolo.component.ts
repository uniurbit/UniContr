import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared/base-component/base-entity.component';
import {Location} from '@angular/common';
import { MappingRuoloService } from 'src/app/services/mappingruolo.service';

@Component({
    selector: 'app-ruolo',
    templateUrl: '../../shared/base-component/base-entity.component.html',
    standalone: false
})

//ng g c application/components/MappingUfficioComponent -s true --spec false -t true

export class MappingRuolo extends BaseEntityComponent {
  
  isLoading = true;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'unitaorganizzativa_uo',
          className: "col-md-12",
          type: 'external',          
          props: {
            label: 'Riferimento unità organizzativa',
            type: 'string',
            entityName: 'unitaorganizzativa',
            entityLabel: 'Unità organizzativa',
            codeProp: 'uo',        
            descriptionProp: 'descr',
            initdescription: 'descrizione_uo',
            description: 'Descrizione',
            descriptionFunc: (data) => {              
              if (data && data.descr){    
                this.model.descrizione_uo = data.descr                        
                return data.descr;
              }
              return null;
            }
          },      
        },    
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'role_id',
          className: "col-md-12",
          type: 'external',          
          props: {
            label: 'Ruolo',
            type: 'string',
            entityName: 'role',
            entityLabel: 'Ruolo',
            codeProp: 'id',        
            descriptionProp: 'name',
            initdescription: 'role.name',
            description: 'Descrizione'
          },      
        },    
      ]
    }     
  ];  

  constructor(protected service: MappingRuoloService, protected route: ActivatedRoute, protected router: Router, protected location: Location) {
    super(route,router,location);    
    this.activeNew =true;
    this.isRemovable = true;
    this.researchPath = 'home/mappingruoli';
    this.newPath = this.researchPath+'/new';
  }

 

  
}
