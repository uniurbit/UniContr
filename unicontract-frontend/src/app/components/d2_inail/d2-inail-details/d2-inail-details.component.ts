import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { D2Inail } from './../../../classes/d2Inail';
import { D2InailService } from './../../../services/d2Inail.service';
import { DatePipe } from '@angular/common';
import { PrecontrattualeService } from 'src/app/services/precontrattuale.service';
import { encode, decode } from 'base64-arraybuffer';

@Component({
    selector: 'app-d2-inail-details',
    templateUrl: './d2-inail-details.component.html',
    styleUrls: ['./d2-inail-details.component.css'],
    providers: [DatePipe],
    standalone: false
})
export class D2InailDetailsComponent extends BaseComponent {

  items: D2Inail = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private inailService: D2InailService,
              private precontrattualeService: PrecontrattualeService,
              private datePipe: DatePipe,
              private tools: InsegnamTools,
              private goto: RouteMetods) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.inailService.getInail(+params.get('id')).subscribe(
          response => this.items = response['datiInail'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateD2(idD2: number) {
    this.router.navigate(['home/inail', idD2, {upd: 'on'}]);
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }

}
