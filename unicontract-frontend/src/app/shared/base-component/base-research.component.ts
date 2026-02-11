import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { FormlyFieldConfig, FormlyFieldProps } from '@ngx-formly/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceQuery } from '../query-builder/query-builder.interfaces';
import { saveAs } from 'file-saver';
import { encode, decode } from 'base64-arraybuffer';

@Component({
    template: ` `,
    standalone: false
})

// ng g c submission/components/roles -s true --spec false -t true


export class BaseResearchComponent implements OnInit {

  public isLoading = false;
  public fieldsRow: FormlyFieldConfig[] = [];

  @ViewChild('apri', { static: true }) apri: TemplateRef<any>;
  @ViewChild('comandi', { static: true }) comandi: TemplateRef<any>;

  builderoptions:  FormlyFieldProps;

  form = new UntypedFormGroup({});

  public rules;

  public model = {
    data: new Array<any>(),
  };

  protected querymodel = {
    rules: new Array<any>(),
  };

  public resultMetadata: FormlyFieldConfig[] = []; // = this.fieldsRow;

  protected routeAbsolutePath = 'home/';

  enableNew = true;
  enabledExport = false;

  title = null;

  protected lastData = null;

  protected service: ServiceQuery;

  // sessionId ricerca titulus
  protected sessionId: null;

  //utilizzata per inizializzazione valori in cache
  protected init: boolean = false;
  protected prefix: string = null;

  constructor(protected router: Router, protected route: ActivatedRoute) {
  }

  ngOnInit() {  
  }

  initRule(){
    if (this.getStorageRules()) {
      let rules = JSON.parse(this.getStorageRules());
      //console.log('regole ' + JSON.stringify(rules));

      this.builderoptions = {
        min: rules.length
      };
      this.rules = rules;
      
      this.setQueryModel({
        rules: rules
      },false);
    }
  }

  onNew(event) {
    this.router.navigate([this.routeAbsolutePath + '/new']);
  }

  getStorageRules(){
    if (this.prefix){
      return sessionStorage.getItem(this.prefix+'_rules');
    }     
    return null;
  }

  getStorageResult(){
    if (this.prefix){
      return sessionStorage.getItem(this.prefix+'_result');
    }     
    return null;
  }

  setStorageResult(){
    if (this.prefix){
      sessionStorage.setItem(this.prefix+'_result',JSON.stringify(this.lastData));
    } 
  }

  setStorageRules(model){
    if (this.prefix){
        //console.log('set rules '+JSON.stringify(model.rules));
      sessionStorage.setItem(this.prefix+'_rules',JSON.stringify(model.rules));
    }
  }

  onDblclickRow(event) {
    this.setStorageResult();
    // , {relativeTo: this.route}       
    if (event.type === 'dblclick') {
      if (event.row.insegn_id) {
        // caso particolare mantenuto per compatibilità
        this.router.navigate([this.routeAbsolutePath, event.row.insegn_id]);
      } else {
        this.router.navigate([this.routeAbsolutePath, event.row.id]);
      }
    }
  }


  protected setQueryModel(model, reset = true){
    if (reset) {
      this.setStorageRules(model);  
    }
    this.querymodel.rules = this.getRules(model); 
  }

  protected getRules(model) {
    return model.rules;
  }

  onFind(model, reset = true) {
   
    if (reset) {
      this.setStorageRules(model);  
    }

    this.querymodel.rules = this.getRules(model);    

    if (reset) {
      this.resetQueryModel();
    }

    this.isLoading = true;
    // this.service.clearMessage();
    try {
      this.service.query(this.querymodel).subscribe((data) => {
      
        this.isLoading = false;
        this.setResult(data);      
      }, err => {
        this.isLoading = false;
        console.error('Oops:', err.message);
      });
    } catch (e) {
      this.isLoading = false;
      console.error(e);
    }
  }

  setResult(data){
    this.isLoading = false;
    let to = this.resultMetadata[0].props;
    this.lastData = data;

    this.model = {
      data: data.data
    };

    this.sessionId = data.sessionId;

    to.page.totalElements = data.total; // data.to;
    to.page.pageNumber = data.current_page - 1;
    to.page.size = data.per_page;
    
    this.setStorageResult();
  }

  onSetPage(pageInfo) {
    if (this.sessionId) {
      this.querymodel['sessionId'] = this.sessionId;
    }
    if (pageInfo.limit) {
      this.querymodel['limit'] = pageInfo.limit;
    }
    if (this.model.data.length > 0) {
      this.querymodel['page'] = pageInfo.offset + 1;
      this.onFind(this.querymodel, false);
    }
  }

  
  onSetPageWithInit(pageInfo) {
    if (this.sessionId) {
      this.querymodel['sessionId'] = this.sessionId;
    }
    if (pageInfo.limit) {
      this.querymodel['limit'] = pageInfo.limit;
    }
    if (!this.init){
      if (this.model.data.length > 0) {
        this.querymodel['page'] = pageInfo.offset + 1;    
        this.onFind(this.querymodel, false);           
      }
    }
    this.init = false;
  }

  protected resetQueryModel() {
    this.querymodel['sessionId'] = null;
    this.querymodel['page'] = null;
  }

  protected resetResult() {
    this.lastData = [];
    this.model = {
      data: [],
    };
    this.setStorageResult();
  }


  onExport() {
    // richiamare export dal service
    if (this.model.data.length > 0) {
      this.isLoading = true;
      this.service.export(this.querymodel).subscribe(file => {
        this.isLoading = false;

        const blob = new Blob([file]);
        saveAs(blob, 'download.csv');

      },
        e => {  this.isLoading = false; console.log(e); }
      );
    }
  }

  onExportXLS(){
    // richiamare export dal service
    if (this.model.data.length > 0) {
     this.isLoading = true;
     this.service.exportxls(this.querymodel).subscribe(file => {
       this.isLoading = false;

       const blob =  new Blob([file]);
       saveAs(blob, 'download.xlsx');

     },
       e => {  this.isLoading = false; console.log(e); }
     );
   }
 }

 rowSelection(row) {
  this.setStorageResult();      
  if (row.insegn_id) {
    // caso particolare mantenuto per compatibilità
    this.router.navigate([this.routeAbsolutePath, row.insegn_id]);
  } else if (row.id) {
    this.router.navigate([this.routeAbsolutePath, row.id]);
  }
}

  downloadSelection(value) {

  }

  downloadDisabled(value) {
    return false;
  }

}
