import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { D6DetrazioniFamiliari } from './../../../classes/d6detrazioniFamiliari';
import { D6DetrazioniFamiliariService } from './../../../services/d6detrazioniFamiliari.service';
import { DatePipe } from '@angular/common';
import { PrecontrattualeService } from 'src/app/services/precontrattuale.service';
import { encode, decode } from 'base64-arraybuffer';
import { UpdSubmit } from './../../../classes/validazioni';

@Component({
    selector: 'app-d6-detrazionifamiliari-details',
    templateUrl: './d6-detrazionifamiliari-details.component.html',
    styleUrls: ['./d6-detrazionifamiliari-details.component.css'],
    providers: [DatePipe],
    standalone: false
})
export class D6DetrazionifamiliariDetailsComponent extends BaseComponent {

  items: D6DetrazioniFamiliari = null;
  private validation: UpdSubmit;
  currentDate = new Date();

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private d6Service: D6DetrazioniFamiliariService,
              private precontrattualeService: PrecontrattualeService,
              private datePipe: DatePipe,
              private tools: InsegnamTools,
              private goto: RouteMetods) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.d6Service.getDatiDetrazioni(+params.get('id')).subscribe(
          response => this.items = response['datiFamiliari'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateD6(idD6: number) {
    this.router.navigate(['home/familiari', idD6, {upd: 'on'}]);
  }

  relazione(value: string) {
    if (value === 'F1') {
      return 'Primo figlio';
    } else if (value === 'F') {
      return 'Altro figlio';
    } else if (value === 'A') {
      return 'Altro familiare';
    }
  }

  disabilita(value: number) {
    if (value === 0) {
      return 'NO';
    } else {
      return 'SÌ';
    }
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }

}
