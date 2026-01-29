import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { NotificaService } from '../notifica.service';



@Component({
    selector: 'app-view-notifiche',
    templateUrl: './view-notifiche.component.html',
    styleUrls: ['./view-notifiche.component.css'],
    standalone: false
})
export class ViewNotificheComponent implements OnInit {

  @Input() riferimento = 'generale';  
  @Input() id = null;


  constructor(private router: Router,  private datePipe: DatePipe, private notificaService: NotificaService) { }

  ngOnInit() {
    if (this.riferimento == 'generale'){
      const today = this.datePipe.transform(Date.now(), 'dd-MM-yyyy');  
      this.notificaService.query({
        'rules': [
          { field: "riferimento", operator: "=", value: this.riferimento, type: "" },
          { field: "stato", operator: "=", value: "attivo", type: "" },
          { field: "data_inizio", operator: "<=", value: today, type: "date" },
          { field: "data_fine",  operator: ">=", value: today, type: "date" },        
        ]
      }).subscribe((data) => {
        //devi sostituire tutti i tipi 'riferimento' con gli attuali                 
        this.notificaService.newNotifiche(data.data, this.riferimento);                
      }, err => {    
        console.error('Oops:', err.message);
      });
    
    }
     
  }
  
  get notifiche$ (){
    if (this.riferimento){
      return this.notificaService.notifiche$.pipe(map(notifiche => {
       return notifiche ? notifiche.filter(x=> x.riferimento == this.riferimento) : []
      }));
    }
    return this.notificaService.notifiche$;
  }
 
}
