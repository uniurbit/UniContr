import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { EOccasionale } from './../../../classes/eOccasionale';
import { EOccasionaleService } from './../../../services/eOccasionale.service';
import { UpdSubmit } from './../../../classes/validazioni';

import { DatePipe } from '@angular/common';
import { PrecontrattualeService } from 'src/app/services/precontrattuale.service';

@Component({
  selector: 'app-e-occasionale-details',
  templateUrl: './e-occasionale-details.component.html',
  styleUrls: ['./e-occasionale-details.component.css'],
  providers: [DatePipe]
})
export class EOccasionaleDetailsComponent extends BaseComponent {

  items: EOccasionale = null;
  private validation: UpdSubmit;
  currentDate = new Date();

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private occasionaleService: EOccasionaleService,
              private precontrattualeService: PrecontrattualeService,
              private datePipe: DatePipe,
              private tools: InsegnamTools,
              private goto: RouteMetods) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.occasionaleService.getOccasionale(+params.get('id')).subscribe(
          response => this.items = response['datiModelloE'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateE(idE: number) {
    this.router.navigate(['home/occasionale', idE, {upd: 'on'}]);
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }

}
