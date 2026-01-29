import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { B6Informativa } from './../../../classes/b6informativa';
import { B6InformativaService } from './../../../services/b6informativa.service';
import { PrecontrattualeService } from 'src/app/services/precontrattuale.service';

import { UpdSubmit } from './../../../classes/validazioni';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-b6-privacy-details',
    templateUrl: './b6-privacy-details.component.html',
    styleUrls: ['./b6-privacy-details.component.css'],
    providers: [DatePipe],
    standalone: false
})

export class B6PrivacyDetailsComponent extends BaseComponent {

  items: any = null;
  private validation: UpdSubmit;
  currentDate = new Date();

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private informativaService: B6InformativaService,
              private precontrattualeService: PrecontrattualeService,
              private datePipe: DatePipe,
              private tools: InsegnamTools,
              private goto: RouteMetods) { super(messageService);  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.informativaService.getPrivacy(+params.get('id')).subscribe(
          response => this.items = response['datiInformativa'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateB6(idB6: number) {
    this.router.navigate(['home/privacy', idB6, {upd: 'on'}]);
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }


}
