import { Component, OnInit } from '@angular/core';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormGroup, FormArray } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseEntityComponent } from 'src/app/shared';
import {Location} from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: '../../shared/base-component/base-entity.component.html',
})

// ng g c application/components/user -s true --spec false -t true

export class UserComponent extends BaseEntityComponent {

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
            disabled: true
          }
        },
        {
          key: 'name',
          type: 'input',
          className: 'col-md-5',
          templateOptions: {
            label: 'Nome utente',
            required: true
          }
        },
        {
          key: 'email',
          type: 'input',
          className: 'col-md-5',
          templateOptions: {
            label: 'Email',
            required: true
          },
        }
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'v_ie_ru_personale_id_ab',
          type: 'input',
          className: 'col-md-3',
          templateOptions: {
            label: 'Codice personale per ufficio',
            required: true,
            // disabled: true
          }
        },
        {
          key: 'blocked_date',
          type: 'date',
          className: 'col-md-3',
          templateOptions: {
            label: 'Data di blocco utente',
            // disabled: true
          }
        },
      ]
    },
    {
      key: 'roles',
      type: 'datatable',
      wrappers: ['accordion'],
      templateOptions: {
        label: 'Ruoli',
        columnMode: 'flex',
        scrollbarH: false,
        limit: '50',
        onDblclickRow: (event) => this.onDblclickRow(event),
      },
      fieldArray: {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'name',
            type: 'select',
            templateOptions: {
              options: this.service.getRoles(),
              valueProp: 'name',
              labelProp: 'name',
              label: 'Ruolo',
              required: true,
              column: { flexGrow: 3 },
            },
            expressionProperties: {
              'templateOptions.disabled': (model: any, formState: any) => {
                // access to the main model can be through `this.model` or `formState` or `model
                return model.id;
              },
            },
          },
          // {
          //   type: 'button',
          //   //className: "col-md-4",
          //   templateOptions: {
          //     icon: 'oi oi-external-link',
          //     btnType: 'btn-outline-primary',
          //     onClick: ($event) => {},
          //     column: { flexGrow: 1 },
          //   },
          // },
        ]
      },
    },
    {
      template: '<div class="mt-2"></div>',
    },
    {
        key: 'permissions',
        type: 'datatable',
        wrappers: ['accordion'],
        templateOptions: {
          label: 'Permessi',
          columnMode: 'force',
          scrollbarH: false,
          limit: '50',
        },

        fieldArray: {
          fieldGroupClassName: 'row',
          fieldGroup: [
            // {
            //   key: 'id',
            //   type: 'input',
            //   templateOptions: {
            //     label: 'Id',
            //     disabled: true,
            //     column: { width: 5 }
            //   }
            // },
            {
              key: 'name',
              type: 'select',
              templateOptions: {
                options: this.service.getPermissions(),
                valueProp: 'name',
                labelProp: 'name',
                label: 'Permesso',
                required: true
              },
              expressionProperties: {
                'templateOptions.disabled': (model: any, formState: any) => {
                  // access to the main model can be through `this.model` or `formState` or `model
                  return model.id;
                },
              },
            },
            // {
            //   key: 'guard_name',
            //   type: 'input',
            //   templateOptions: {
            //     label: 'Guardia',
            //     disabled: true,
            //     required: false
            //   }
            // }
          ]
        }
    }
  ];

  constructor(protected service: UserService, protected route: ActivatedRoute, protected router: Router, protected location: Location) {
    super(route, router, location);
    // this.title = "Utente";
    this.researchPath = 'home/users';
    this.isRemovable = true;
    this.activeNew = true;
  }

  onDblclickRow(event) {
    if (event.type === 'dblclick') {
      if (event.row.id) {
        this.router.navigate(['home/roles', event.row.id]);
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

  preUpdate(toSubmit) {
    toSubmit.permissions = {...this.model.permissions};
    toSubmit.roles = {...this.model.roles};
  }
}
