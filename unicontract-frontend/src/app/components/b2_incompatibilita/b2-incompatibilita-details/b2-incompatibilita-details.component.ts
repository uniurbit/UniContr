import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { B2IncompatibilitaService } from './../../../services/b2incompatibilita.service';
import { B2Incompatibilita } from './../../../classes/b2incompatibilita';

@Component({
  selector: 'app-b2-incompatibilita-details',
  templateUrl: './b2-incompatibilita-details.component.html',
  styleUrls: ['./b2-incompatibilita-details.component.css']
})
export class B2IncompatibilitaDetailsComponent extends BaseComponent {

  items: B2Incompatibilita;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private incompatService: B2IncompatibilitaService,              
              private tools: InsegnamTools,
              private goto: RouteMetods) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.incompatService.getIncompat(+params.get('id')).subscribe(
          response => this.items = response['datiIncompatib'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  checkFalse(value: number) {
    if (value === 1) {
      return 'non';
    }
  }

  updateB2(id: number) {
    this.router.navigate(['home/incompat', id, {upd: 'on'}]);
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }

}
