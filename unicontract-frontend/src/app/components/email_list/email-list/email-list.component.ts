import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { EmailListService } from './../../../services/emailList.service';

@Component({
    selector: 'app-email-list',
    templateUrl: './email-list.component.html',
    styleUrls: ['./email-list.component.css'],
    standalone: false
})
export class EmailListComponent extends BaseComponent {

  items: any = null;
  precontr: any = null;
  idins: number;

  page = 1;
  pageSize = 15;
  totalItems: number;

  constructor(private route: ActivatedRoute,
    private router: Router,
    public messageService: MessageService,
    private emailListService: EmailListService,
    private precontrattualeService: PrecontrattualeService,
    protected translateService: TranslateService,
    private tools: InsegnamTools) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        //id che viene passato come parametro è l'insegnamento id 
        this.emailListService.getEmailList(+params.get('id')).subscribe(
          response => {
            this.precontr = response['datiPrecontrattuale'];
            this.items = this.precontr.emailList;

            this.idins = +params.get('id');
            this.totalItems = this.items.length;
          },
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  summary() {
    this.router.navigate(['home/summary', this.idins]);
  }

  receiver(value: string) {
    if (value === 'RCP' || value === 'INFO') {
      return 'Docente';
    }
    return 'Uffici';
  }

}
