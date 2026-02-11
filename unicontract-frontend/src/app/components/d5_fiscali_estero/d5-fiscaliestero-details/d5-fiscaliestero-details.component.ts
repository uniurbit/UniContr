import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { D5FiscaliEstero } from './../../../classes/d5fiscaliEstero';
import { D5FiscaliEsteroService } from './../../../services/d5fiscaliEstero.service';
import { PrecontrattualeService } from 'src/app/services/precontrattuale.service';

@Component({
    selector: 'app-d5-fiscaliestero-details',
    templateUrl: './d5-fiscaliestero-details.component.html',
    styleUrls: ['./d5-fiscaliestero-details.component.css'],
    standalone: false
})
export class D5FiscaliesteroDetailsComponent extends BaseComponent {

  items: D5FiscaliEstero = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private d5Service: D5FiscaliEsteroService,
              private precontrattualeService: PrecontrattualeService,
              private tools: InsegnamTools,
              private goto: RouteMetods) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.d5Service.getDatiFiscaliEstero(+params.get('id')).subscribe(
          response => this.items = response['datiFiscaliEstero'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateD5(idD5: number) {
    this.router.navigate(['home/fiscaliestero', idD5, {upd: 'on'}]);
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }

}
