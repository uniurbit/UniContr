import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { CPrestazProfessService } from './../../../services/cPrestazProfess.service';
import { UpdSubmit } from './../../../classes/validazioni';

import { DatePipe } from '@angular/common';
import { PrecontrattualeService } from 'src/app/services/precontrattuale.service';
import { CPrestazProfessInterface } from 'src/app/interface/cPrestazProfessionale.interface';

@Component({
  selector: 'app-c-prestaz-profess-details',
  templateUrl: './c-prestaz-profess-details.component.html',
  styleUrls: ['./c-prestaz-profess-details.component.css'],
  providers: [DatePipe]
})

export class CPrestazProfessDetailsComponent extends BaseComponent {

  items: CPrestazProfessInterface = null;
  private validation: UpdSubmit;
  currentDate = new Date();

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private pivaService: CPrestazProfessService,
              private precontrattualeService: PrecontrattualeService,
              private datePipe: DatePipe,
              private tools: InsegnamTools,
              private goto: RouteMetods) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.pivaService.getPrestazProfess(+params.get('id')).subscribe(
          response => this.items = response['datiPIva'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateC(idC: number) {
    this.router.navigate(['home/cpiva', idC, {upd: 'on'}]);
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }

}
