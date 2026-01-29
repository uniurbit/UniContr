import { Component, OnInit, PipeTransform } from '@angular/core';
import ControlUtils from 'src/app/shared/dynamic-form/control-utils';
import { MyDiffdatePipe } from 'src/app/shared/pipe/custom.diffdatepipe';
import { AuthService } from 'src/app/core';

@Component({
    selector: 'app-dashboard-dipartimenti',
    templateUrl: './dashboard-dipartimenti.component.html',
    styleUrls: ['./dashboard-dipartimenti.component.css'],
    standalone: false
})

export class DashboardDipartimentiComponent implements OnInit {

  public querycontrattidacompletare: any = {};
  public columnsCompletare = [];

  public querycontrattiDaPrendereVisione: any = {};

  constructor(public service: AuthService) { }

  ngOnInit() {
    //non annulati e da completare da parte del docente
    this.querycontrattidacompletare.rules = [        
      { field: "validazioni.flag_submit", operator: "=", value: 0, type: "" },               
      { field: "stato", operator: "=", value: 0, type: "" }   
    ];     
    this.querycontrattidacompletare.orderBy = ['insegnamento.data_delibera','asc'];
    this.columnsCompletare = [ { name: 'Giorni dal conf.', prop: 'insegnamento.data_delibera', pipe: new MyDiffdatePipe(), minWidth: 100, sortable: false } ];

    this.querycontrattiDaPrendereVisione.rules =  [
        { field: "validazioni.flag_submit", operator: "=", value: 1, type: "" },
        { field: "validazioni.flag_upd", operator: "=", value: 1, type: "" },
        { field: "validazioni.flag_amm", operator: "=", value: 1, type: "" },
        { field: "validazioni.flag_accept", operator: "=", value: 0, type: "" },
        { field: "stato", operator: "=", value: 0, type: "" }      
      ];
  }

}
