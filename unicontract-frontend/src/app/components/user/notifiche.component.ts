import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { BaseResearchComponent } from 'src/app/shared';
import { NotificaService } from 'src/app/shared/notifica.service';

@Component({
  selector: 'app-users',
  templateUrl: '../../shared/base-component/base-research.component.html',
})

// ng g c submission/components/user -s true --spec false -t true


export class NotificheComponent extends BaseResearchComponent {
  isLoading = false;
  fieldsRow: FormlyFieldConfig[] = [];


  resultMetadata: FormlyFieldConfig[] = [
    {
      key: 'data',
      type: 'datatablelookup',
      wrappers: ['accordion'],
      templateOptions: {
        label: 'Risultati utenti',
        columnMode: 'force',
        scrollbarH: false,
        page: new Page(25),
        hidetoolbar: true,
        onDblclickRow: (event) => this.onDblclickRow(event),
        onSetPage: (pageInfo) => this.onSetPageWithInit(pageInfo),
        columns: [
          { name: '#', prop: 'id', width: 80, maxWidth: 100 },
          { name: 'Messaggio', prop: 'messaggio' },          
          { name: 'Priorita', prop: 'priorita'},
          { name: 'Riferimento', prop: 'riferimento'},
          { name: 'Data inizio', prop:  'data_inizio'},
          { name: 'Data fine', prop:  'data_fine'},
          { name: 'Tipo vincolo', prop: 'tipo_vincolo' },
          { name: 'Stato', prop: 'stato' }
        ]
      },
      fieldArray: {
        fieldGroup: []
      }
    }];

  constructor(protected service: NotificaService, protected router: Router, protected route: ActivatedRoute) {
    super(router, route);
    this.routeAbsolutePath = 'home/notifiche';
    this.prefix = 'unicontr_notifiche';
    // this.title = "utenti"
    this.initRule();
  }

  ngOnInit() {

    let page = new Page(25);
    let result = null;
    if (this.getStorageResult()){
      result = JSON.parse(this.getStorageResult());
      this.init = true;
      page.totalElements = result.total; // data.to;
      page.pageNumber = result.current_page - 1;
      page.size = result.per_page;
    }

    if (result) {
      this.setResult(result);
    }
  }
}
