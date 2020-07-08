import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { B3RappStudioUnivService } from './../../../services/b3rappStudio.service';
import { B3JoinRapportoService } from './../../../services/b3joinRapporto.service';
import { B3RapportoStudioUniversita } from './../../../classes/b3rappStudio';
import { B3JoinRapporto } from './../../../classes/b3joinRapporto';
import { InjectSetupWrapper } from '@angular/core/testing';
import { ConfirmationDialogService } from './../../../shared/confirmation-dialog/confirmation-dialog.service';
import { ServiceEntity } from './../../../shared/query-builder/query-builder.interfaces';

@Component({
  selector: 'app-b3-rapp-studio-univ-details',
  templateUrl: './b3-rapp-studio-univ-details.component.html',
  styleUrls: ['./b3-rapp-studio-univ-details.component.css']
})
export class B3RappStudioUnivDetailsComponent extends BaseComponent implements OnInit {

  items: B3RapportoStudioUniversita;
  protected service: ServiceEntity;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private rapportoUnivService: B3RappStudioUnivService,              
              private tools: InsegnamTools,
              private goto: RouteMetods) { super(messageService); }

  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.rapportoUnivService.getRappStudio(+params.get('id')).subscribe(
          response => this.items = response['datiRapporto'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateRapporto(idB3: number) {
    this.router.navigate(['home/studio', idB3, {upd: 'on'}]);
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }

}
