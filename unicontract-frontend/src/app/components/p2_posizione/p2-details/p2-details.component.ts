import { Component, OnInit, NgModule } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { P2rapportoService } from './../../../services/p2rapporto.service';
import { P2rapporto } from './../../../classes/p2rapporto';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { RouteMetods } from './../../../classes/routeMetods';
import { MessageService, BaseComponent } from './../../../shared';
import { NotificaService } from 'src/app/shared/notifica.service';


@Component({
    selector: 'app-p2-details',
    templateUrl: './p2-details.component.html',
    styleUrls: ['./p2-details.component.css'],
    standalone: false
})

export class P2DetailsComponent extends BaseComponent {

  item: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private p2rapportoService: P2rapportoService,
              public messageService: MessageService,
              public notificaService: NotificaService,
              private tools: InsegnamTools,
              private goto: RouteMetods) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.p2rapportoService.getRapporto(+params.get('id')).subscribe(
          response => {
            this.item = response['datiRapporto']; 
            this.notificaService.newNotifiche(this.item.notifiche ? this.item.notifiche : [],'contratto'); 
          },
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateP2(idP2: number) {
    this.router.navigate(['home/p2rapporto', idP2, {upd: 'on'}]);
  } 

  isLoadingChange(event) {
    this.isLoading = event;
  }

}
