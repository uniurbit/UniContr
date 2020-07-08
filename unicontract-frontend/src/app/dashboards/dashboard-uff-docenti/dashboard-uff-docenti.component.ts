import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-uff-docenti',
  templateUrl: './dashboard-uff-docenti.component.html',
  styles: []
})
export class DashboardUffDocentiComponent implements OnInit {

  public querycontrattidavalidare: any = {};


  constructor(public service: DashboardService, private datePipe: DatePipe) { }

  ngOnInit() {
    const today = this.datePipe.transform(Date.now(), 'dd-MM-yyyy');       
    this.querycontrattidavalidare.rules = [        
       { field: "validazioni.flag_submit", operator: "=", value: 1, type: "" },
       { field: "validazioni.flag_upd", operator: "=", value: 0, type: "" },             
       { field: "stato", operator: "=", value: 0, type: "" }   
    ];     
             
  }

}
