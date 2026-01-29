import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig  } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { BaseResearchComponent } from 'src/app/shared/base-component/base-research.component';
import { LogAttivitaService } from 'src/app/services/logattivita.service';



@Component({
    selector: 'app-logattivita',
    templateUrl: '../../shared/base-component/base-research.component.html',
    standalone: false
})

//ng g c submission/components/permissions -s true --spec false -t true
export class LogAttivitaComponent extends BaseResearchComponent {
  
  isLoading = false;
  
  fieldsRow: FormlyFieldConfig[] = [];
   
 
  resultMetadata: FormlyFieldConfig[] = [ {
    key: 'data',
    type: 'datatablelookup',
    wrappers: ['accordion'],      
    props: {      
      label: 'Log attività',   
      columnMode: 'force',
      scrollbarH: true,    
      page: new Page(25),
      hidetoolbar: true,      
      onDblclickRow: (event) => this.onDblclickRow(event),
      onSetPage: (pageInfo) => this.onSetPage(pageInfo),      
    },
    fieldArray: {
      fieldGroupClassName: 'row',   
      fieldGroup: this.fieldsRow,
    }
  }];

  constructor(protected service: LogAttivitaService, router: Router, route: ActivatedRoute,)  {    
    super(router,route);    
    
    this.fieldsRow = service.getQueryMetadata();
    this.resultMetadata[0].fieldArray = { fieldGroup: service.getMetadata()};         

    this.routeAbsolutePath = 'home/logattivita'     
    //this.title = 'Tipo pagamenti'
  }
 
  onDblclickRow(event){}

}
