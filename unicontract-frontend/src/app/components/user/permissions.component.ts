import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Page } from 'src/app/shared/lookup/page';
import { PermissionService } from '../../services/permission.service';
import { BaseResearchComponent } from 'src/app/shared';

@Component({
  selector: 'app-permissions',
  templateUrl: '../../shared/base-component/base-research.component.html',
})

// ng g c submission/components/permissions -s true --spec false -t true


export class PermissionsComponent extends BaseResearchComponent {

  isLoading = false;
  fieldsRow: FormlyFieldConfig[] = [
          {
            key: 'id',
            type: 'number',
            hideExpression: false,
            templateOptions: {
              label: 'Id',
              disabled: true,
              column: { width: 10, cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'name',
            type: 'string',
            templateOptions: {
              label: 'Permesso',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          },
          {
            key: 'guard_name',
            type: 'string',
            templateOptions: {
              label: 'Guardia',
              required: true,
              column: { cellTemplate: 'valuecolumn'}
            }
          }
        ];


  resultMetadata = [
    {
      key: 'data',
      type: 'datatablelookup',
      wrappers: ['accordion'],
      templateOptions: {
        label: 'Risultati permessi',
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
    }
  ];

  constructor(protected service: PermissionService, protected router: Router, protected route: ActivatedRoute) {
    super(router, route);
    this.routeAbsolutePath = 'home/permissions';
    // this.title = "permessi"
  }

}
