import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared';
import { SourceMapGenerator } from '@angular/compiler/src/output/source_map';
import {Location} from '@angular/common';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role',
  templateUrl: '../../shared/base-component/base-entity.component.html',
})

// ng g c submission/components/user -s true --spec false -t true

export class RoleComponent extends BaseEntityComponent {
  isLoading = true;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'id',
          type: 'input',
          className: 'col-md-2',
          templateOptions: {
            label: 'Id',
            disabled: true,
          },
          hideExpression: (model: any) => !model.id
        },
        {
          key: 'name',
          type: 'input',
          className: 'col-md-5',
          templateOptions: {
            label: 'Ruolo',
            required: true
          }
        },
        {
          key: 'guard_name',
          type: 'input',
          className: 'col-md-5',
          templateOptions: {
            label: 'Guardia',
            required: true
          },
        }
      ]
    },
    {
        key: 'permissions',
        type: 'datatable',
        wrappers: ['accordion'],
        templateOptions: {
          label: 'Permessi',
          columnMode: 'flex',
          scrollbarH: false,
          limit: '10',
          onDblclickRow: (event) => this.onDblclickRow(event),
        },

        fieldArray: {
          fieldGroup: [
            {
              key: 'name',
              type: 'select',
              templateOptions: {
                options: this.service.getPermissions(),
                valueProp: 'name',
                labelProp: 'name',
                label: 'Permesso',
                required: true,
                column: { flexGrow: 3 },
              },
              expressionProperties: {
                'templateOptions.disabled': (model: any, formState: any) => {
                  // access to the main model can be through `this.model` or `formState` or `model
                  return model.id;
                },
              },
            }
          ]
        }
    }
  ];

  constructor(protected service: RoleService, protected route: ActivatedRoute, protected router: Router, protected location: Location) {
    super(route, router, location);
    // this.title = "Ruolo";
    this.activeNew =true;
    this.newPath = 'home/roles/new';
    this.researchPath = 'home/roles';
  }

  onDblclickRow(event) {
    // , {relativeTo: this.route}
    if (event.type === 'dblclick') {
      if (event.row.id) {
        this.router.navigate(['home/permissions', event.row.id]);
      }
    }
  }

  onReload() {
    if (this.model['id']) {
      this.isLoading = true;
      this.service.getById(this.model['id']).subscribe((data) => {
        this.model = JSON.parse(JSON.stringify(data));
        this.options.updateInitialValue();
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        // this.service.messageService.error(error);
      });
    }
  }

  protected preUpdate(toSubmit) {
    toSubmit.permissions = {...this.model.permissions};
  }

}
