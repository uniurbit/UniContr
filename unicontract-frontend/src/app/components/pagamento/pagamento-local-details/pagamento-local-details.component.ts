import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PagamentoService } from './../../../services/pagamento.service';
import { Pagamento } from './../../../classes/pagamento';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-pagamento-local-details',
    templateUrl: './pagamento-local-details.component.html',
    styleUrls: ['./pagamento-local-details.component.css'],
    standalone: false
})

export class PagamentoLocalDetailsComponent extends BaseComponent {

  item: Pagamento;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private pagamentoService: PagamentoService,
              public messageService: MessageService,
              private goto: RouteMetods,
              protected translateService: TranslateService,
              private tools: InsegnamTools) {
                super(messageService);
              }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.pagamentoService.getPagamentoLocal(+params.get('id')).subscribe(
          response => this.item = response['dati'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  ccType(value: string) {
    if (value === 'CC' || value === 'CB') {
      return this.translateService.instant('a2_conto1');
    } else if (value === 'BP' || value === 'CP') {
      return this.translateService.instant('a2_conto2');
    }
  }

  paymentModality(value: string) {
    if (value === 'ACIC') {
      return this.translateService.instant('a2_check2');
    } else if (value === 'AGBM') {
      return this.translateService.instant('a2_check1');
    }
  }

  updateA2(id: number) {
    this.router.navigate(['home/pagamento/update', id]);
  }

  gotoB1(id: number, idb1: number) {
    if (idb1 === 0) {
      this.router.navigate(['home/conflitto', id]);
    } else {
      this.router.navigate(['home/conflitto/details', idb1]);
    }
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }

}
