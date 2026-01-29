import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { D4Fiscali } from './../../../classes/d4fiscali';
import { D4FiscaliService } from './../../../services/d4fiscali.service';
import { DatePipe } from '@angular/common';
import { PrecontrattualeService } from 'src/app/services/precontrattuale.service';
import { encode, decode } from 'base64-arraybuffer';

@Component({
    selector: 'app-d4-fiscali-details',
    templateUrl: './d4-fiscali-details.component.html',
    styleUrls: ['./d4-fiscali-details.component.css'],
    providers: [DatePipe],
    standalone: false
})
export class D4FiscaliDetailsComponent extends BaseComponent {

  items: any = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private d4Service: D4FiscaliService,
              private precontrattualeService: PrecontrattualeService,
              private datePipe: DatePipe,
              private tools: InsegnamTools,
              private goto: RouteMetods) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.d4Service.getDatiFiscali(+params.get('id')).subscribe(
          response => this.items = response['datiFiscali'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateD4(idD4: number) {
    this.router.navigate(['home/fiscali', idD4, {upd: 'on'}]);
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }

}
