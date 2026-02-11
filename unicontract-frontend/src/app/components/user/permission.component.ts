import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { PermissionService } from '../../services/permission.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared';
import {Location} from '@angular/common';
@Component({
    selector: 'app-permission',
    templateUrl: '../../shared/base-component/base-entity.component.html',
    standalone: false
})

// ng g c submission/components/user -s true --spec false -t true

export class PermissionComponent extends BaseEntityComponent {

  isLoading = true;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'id',
          type: 'input',
          className: 'col-md-2',
          props: {
            label: 'Id',
            disabled: true
          }
        },
        {
          key: 'name',
          type: 'input',
          className: 'col-md-5',
          props: {
            label: 'Permesso',
            required: true
          }
        },
        {
          key: 'guard_name',
          type: 'input',
          className: 'col-md-5',
          defaultValue: 'api',          
          props: {
            readonly: true,
            label: 'Guardia',
            required: true
          },
        }
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'created_at',
          type: 'input',
          className: 'col-md-5',
          props: {
            label: 'Data creazione',
            disabled: true,
          }
        },
      ]
    }
  ];

  // tslint:disable-next-line:max-line-length
  constructor(protected service: PermissionService, protected route: ActivatedRoute, protected router: Router, protected location: Location) {
    super(route, router, location);
    // this.title = 'Permesso'
    this.activeNew = true;
    this.researchPath = 'home/permissions';
    this.newPath = 'home/permissions/new';
  }

}
