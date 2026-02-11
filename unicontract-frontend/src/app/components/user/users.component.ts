import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserComponent } from './user.component';
import { Page } from 'src/app/shared/lookup/page';
import { BaseResearchComponent } from 'src/app/shared';

@Component({
    selector: 'app-users',
    templateUrl: '../../shared/base-component/base-research.component.html',
    standalone: false
})

// ng g c submission/components/user -s true --spec false -t true


export class UsersComponent extends BaseResearchComponent {
  isLoading = false;
  fieldsRow: FormlyFieldConfig[] = [
          {
            key: 'id',
            type: 'number',
            props: {
              label: 'Id',
              disabled: true,
              column: { width: 10, cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'name',
            type: 'string',
            props: {
              label: 'Nome utente',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'cf',
            type: 'string',
            props: {
              label: 'Codice fiscale',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'email',
            type: 'string',
            props: {
              label: 'Email',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'blocked_date',
            type: 'date',
            className: 'col-md-6',
            props: {
              label: 'Data di blocco utente',
              column: { cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'roles.name',
            type: 'string',
            props: {
              label: 'Ruolo',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },
        ];


  resultMetadata: FormlyFieldConfig[] = [
    {
      key: 'data',
      type: 'datatablelookup',
      wrappers: ['accordion'],
      props: {
        label: 'Risultati utenti',
        columnMode: 'force',
        scrollbarH: false,
        page: new Page(25),
        hidetoolbar: true,
        onDblclickRow: (event) => this.onDblclickRow(event),
        onSetPage: (pageInfo) => this.onSetPageWithInit(pageInfo),
        columns: [
          { name: '#', prop: 'id', width: 80, maxWidth: 100 },
          { name: 'Nome utente', prop: 'name' },          
          { name: 'Email', prop: 'email' },
          { name: 'Codice fiscale', prop: 'cf' },          
          { name: 'Data blocco', prop: 'blocked_date', maxWidth: 150 },
          { name: 'Codice personale Ugov', prop: 'v_ie_ru_personale_id_ab' },          
          { name: 'Lista ruoli', prop:  'listaruoli'}
        ]
      },
      fieldArray: {
        fieldGroup: []
      }
    }];

  constructor(protected service: UserService, protected router: Router, protected route: ActivatedRoute) {
    super(router, route);
    this.routeAbsolutePath = 'home/users';
    this.prefix = 'unicontr_users';
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
