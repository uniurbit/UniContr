import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-uff-trattamenti',
  templateUrl: './dashboard-uff-trattamenti.component.html',
  styleUrls: ['./dashboard-uff-trattamenti.component.css']
})
export class DashboardUffTrattamentiComponent implements OnInit, AfterViewInit {

  public querycontrattidavalidare: any = {};

  constructor(public service: DashboardService, private datePipe: DatePipe) {
  
  }



  ngAfterViewInit() {
   
  }

  ngOnInit(): void {
    const today = this.datePipe.transform(Date.now(), 'dd-MM-yyyy'); 

    this.querycontrattidavalidare.rules = [        
      { field: "validazioni.flag_submit", operator: "=", value: 1, type: "boolean" },
      { field: "validazioni.flag_upd", operator: "=", value: 1, type: "boolean" },      
      { field: "validazioni.flag_amm", operator: "=", value: 0, type: "boolean" },      
      { field: "stato", operator: "=", value: 0, type: "" }   
    ];
  }

  // x.namelist = x.assignments.reduce(function(acc, el){
  //   return acc + ', ' + el.personale.nome + ' ' + el.personale.cognome;
  // },'')
}
