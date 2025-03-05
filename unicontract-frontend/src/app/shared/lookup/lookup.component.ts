import { Component, OnInit, Input, Injector } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { ServiceQuery, IQueryMetadata } from '..';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import ControlUtils from '../dynamic-form/control-utils';
import { Page } from './page';
import { getLocaleExtraDayPeriodRules } from '@angular/common';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styles: []
})

// ng g c shared/lookup -s true  --spec false
export class LookupComponent implements OnInit {

  @Input() entityName; 
  @Input() entityLabel;
  @Input() rules;
  @Input() enableNew = false;

  isLoading: boolean = false;
  service: ServiceQuery;

  researchMetadata: FormlyFieldConfig[];
  form = new UntypedFormGroup({});

  model = {    
    data: new Array<any>(),
  };

  resultMetadata: FormlyFieldConfig[];

  closeResult: string;
  selected: any;

  ngOnInit(): void {    
    const servicename = ControlUtils.getServiceName(this.entityName)
    this.service = this.injector.get(servicename) as ServiceQuery;
    
    if ('getQueryMetadata' in this.service ){
      this.researchMetadata = (this.service as any).getQueryMetadata();
    }else {
      this.researchMetadata = this.service.getMetadata();
    }
    this.resultMetadata =  [
      {
          key: 'data',
          type: 'datatablelookup',
          wrappers: ['accordion'],      
          templateOptions: {
            label: this.entityLabel,   
            columnMode: 'force',
            scrollbarH: true,                
            hidetoolbar: true,        
            rowHeight: 50,             
            selected: [],             
            page: new Page(20),
            onDblclickRow: (event) => this.onDblclickRow(event),
            onSetPage: (pageInfo) => this.onSetPage(pageInfo)                                             
          },
          fieldArray: {
            fieldGroupClassName: 'row',   
            fieldGroup: this.service.getMetadata()
          }
        }
      ];

    this.selected = this.resultMetadata[0].templateOptions.selected;
    
  }

  

  constructor(public activeModal: NgbActiveModal, private injector: Injector) {
  
  }  

  close(){
    if (this.resultMetadata[0].templateOptions.selected.length>0)
      this.activeModal.close(this.resultMetadata[0].templateOptions.selected[0]);
  }

  onDblclickRow(event) {    
    if (event.type === 'dblclick') {          
      this.activeModal.close(event.row);
    }
  }
  
  onNew(event) {        
    this.activeModal.close('new');    
  }

  onFind(model){
    
    console.log(model.rules);

    this.querymodel.rules = model.rules;  
    this.isLoading = true;        
    try{
    this.service.query(this.querymodel).subscribe((data) => {
      const to = this.resultMetadata[0].templateOptions;
      this.isLoading = false;   
      this.model = {
        data: data.data
      }
      to.page.totalElements = data.total; 
      to.page.pageNumber = data.current_page-1;
      to.page.size = data.per_page;        
        
      }, err => {
        this.isLoading=false;       
        this.reset();   
        console.error('Oops:', err.message);
      });
    }catch(e){
      this.isLoading = false;            
      this.reset();   
      console.error(e);
    }
  }

  querymodel = {
    rules: new Array<any>(),    
  };

  onSetPage(pageInfo){      
    if (pageInfo.limit)
      this.querymodel['limit']= pageInfo.limit;     
    if (this.model.data.length>0){
      this.querymodel['page']=pageInfo.offset + 1;     
      this.onFind(this.querymodel);
    }
  }

  reset(){
    const to = this.resultMetadata[0].templateOptions;
    this.model = {
      data: new Array<any>()
    }
    to.page = new Page(20);
    
  }


}