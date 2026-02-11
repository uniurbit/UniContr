import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';

import { tap, map } from 'rxjs/operators';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { NotificationService } from '../../notification.service';
@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.css'],
    standalone: false
})
export class NotificationsComponent implements OnInit{

  isLoading: boolean = false;
  model: any;

  constructor(private service: NotificationService, private modalService: NgbModal, public activeModal: NgbActiveModal, protected router: Router) {}

  form =  new UntypedFormGroup({});
  modelNotification: any = {};
  options: FormlyFormOptions = {};

  fields: FormlyFieldConfig[] = [  
    {
      key: 'subject',
      type: 'input',
      props: {
        label: 'Oggetto',        
        disabled: true,        
      },
    },
    {
      key: 'description',
      type: 'textarea',
      props: {
        label: 'Contenuto',
        disabled: true,  
        rows: 5,      
      }
    }    
  ];
  
  querymodel = {
    rules: new Array<any>(),    
  };
  page: {
    size: number;
    totalElements: any;
    pageNumber: any;
    previousPage: any;
  };


  ngOnInit(): void {        
    this.loadData();
  }

  open(content, notification) {
    if (notification.data.subject || notification.data.description){
      this.modelNotification = notification.data;      
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {   
      }, (reason) => {      
      });
    } 
  }

  onOpen(notification){
    //a quale entità è riferito
    //model_type: "App\Convenzione"
    //model_type: "App\Scadenza"
    if (!notification.data)
      return;
      
    if (notification.data.model_type == 'App\\Convenzione'){
      this.router.navigate(['home/convdetails', notification.data.model_id]);
    }
    if (notification.data.model_type == 'App\\Scadenza'){
      this.router.navigate(['home/scadenzeview', notification.data.model_id]);
    }

  }
    
  loadPage(pageNumber: number) {
    console.log(pageNumber)
    if (this.page.pageNumber !== this.page.previousPage) {
      this.page.previousPage = pageNumber;
      this.loadData();
    }
  }


  loadData() {
    if (this.page){
      this.querymodel['limit']= this.page.size;
      this.querymodel['page']= this.page.pageNumber;
    }
    this.isLoading = true;
    this.service.query(this.querymodel).pipe(      
      tap(x =>  setTimeout(()=> { this.isLoading = false; }, 0) )
    ).subscribe(
      (res) => {
        this.model = res.data;

        this.page = {
          totalElements: res.total,
          pageNumber: res.current_page,
          size: res.per_page,
          previousPage:  res.current_page,
        }        
      }
    );
  }
  
  
}

