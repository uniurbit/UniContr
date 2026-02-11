import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Page } from 'src/app/shared/lookup/page';
import { BaseResearchComponent } from 'src/app/shared';
import { RoleService } from '../../services/role.service';

@Component({
    selector: 'app-roles',
    templateUrl: '../../shared/base-component/base-research.component.html',
    standalone: false
})

// ng g c submission/components/roles -s true --spec false -t true


export class RolesComponent extends BaseResearchComponent {

  isLoading = false;
  fieldsRow: FormlyFieldConfig[] = [
          {
            key: 'id',
            type: 'number',
            hideExpression: false,
            props: {
              label: 'Id',
              disabled: true,
              column: { width: 10, cellTemplate: 'valuecolumn' }
            }
          },
          {
            key: 'name',
            type: 'string',
            props: {
              label: 'Ruolo',
              required: true,
              column: { cellTemplate: 'valuecolumn' }
            }
          },
          {
            key: 'guard_name',
            type: 'string',
            props: {
              label: 'Guardia',
              required: true,
              column: { cellTemplate: 'valuecolumn' }
            }
          }
        ];

  resultMetadata: FormlyFieldConfig[] = [
    {
      key: 'data',
      type: 'datatablelookup',
      wrappers: ['accordion'],
      props: {
        label: 'Risultati ruoli',
        columnMode: 'force',
        scrollbarH: false,
        page: new Page(25),
        hidetoolbar: true,
        onDblclickRow: (event) => this.onDblclickRow(event),
        onSetPage: (pageInfo) => this.onSetPage(pageInfo),
      },
      fieldArray: {
        fieldGroupClassName: 'row',
        fieldGroup: this.fieldsRow,
      }
    }];

  constructor(protected service: RoleService, protected router: Router, protected route: ActivatedRoute, ) {
    super(router, route);
    this.routeAbsolutePath = 'home/roles';
    // this.title = "ruoli"
  }

}
