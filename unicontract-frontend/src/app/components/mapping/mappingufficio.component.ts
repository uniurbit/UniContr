import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared/base-component/base-entity.component';
import {Location} from '@angular/common';
import { MappingUfficioService } from 'src/app/services/mappingufficio.service';
@Component({
  selector: 'app-mappingufficio', 
  templateUrl: '../../shared/base-component/base-entity.component.html',
})

//ng g c application/components/MappingUfficioComponent -s true --spec false -t true

export class MappingUfficioTitulus extends BaseEntityComponent {
  
  isLoading = true;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'unitaorganizzativa_uo',
          className: "col-md-12",
          type: 'external',          
          templateOptions: {
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
          key: 'strutturainterna_cod_uff',
          className: "col-md-12",
          type: 'external',          
          templateOptions: {
            label: 'Riferimento struttura interna',
            type: 'string',
            entityName: 'strutturainterna',
            entityLabel: 'Struttura interna',
            codeProp: 'cod_uff',        
            descriptionProp: 'nome',
            initdescription: 'descrizione_uff',
            description: 'Descrizione',
            descriptionFunc: (data) => {              
              if (data && data.nome){    
                this.model.descrizione_uff = data.nome                        
                return data.nome;
              }
              return null;
            }
          },      
        },    
      ]
    }     
  ];  

  constructor(protected service: MappingUfficioService, protected route: ActivatedRoute, protected router: Router, protected location: Location) {
    super(route,router,location);    
    this.activeNew =true;
    this.isRemovable = true;
    this.researchPath = 'home/mappinguffici';
    this.newPath = this.researchPath+'/new';
  }

 

  
}
