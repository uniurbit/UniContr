import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { B5StatoPensionamento } from './../../../classes/b5statoPensionamento';
import { B5StatoPensionamentoService } from './../../../services/b5statoPensionam.service';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
    selector: 'app-b5-stato-pension-details',
    templateUrl: './b5-stato-pension-details.component.html',
    styleUrls: ['./b5-stato-pension-details.component.css'],
    standalone: false
})
export class B5StatoPensionDetailsComponent extends BaseComponent {

  items: any = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private statoPensionamentoService: B5StatoPensionamentoService,              
              public tools: InsegnamTools,
              public goto: RouteMetods) { super(messageService);  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    // this.items = new B5StatoPensionamento();
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.statoPensionamentoService.getStatoPension(+params.get('id')).subscribe(
          response => this.items = response['datiStatoPensionam'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateB5(idB5: number) {
    this.router.navigate(['home/pension', idB5, {upd: 'on'}]);
  }

  gotoB6(idins: number, idb6: number) {
    if (idb6 === 0) {
      this.router.navigate(['home/privacy', idins]);
    } else {
      this.router.navigate(['home/privacy/details', idb6]);
    }
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }

}
