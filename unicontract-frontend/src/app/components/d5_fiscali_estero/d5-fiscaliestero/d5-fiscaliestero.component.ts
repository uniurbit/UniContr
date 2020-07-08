import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { UpdD5 } from './../../../classes/precontrattuale';
import { D5FiscaliEstero } from './../../../classes/d5fiscaliEstero';
import { D5FiscaliEsteroService } from './../../../services/d5fiscaliEstero.service';
import { StoryProcessService } from './../../../services/storyProcess.service';
import { StoryProcess } from './../../../classes/storyProcess';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { encode, decode } from 'base64-arraybuffer';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';

@Component({
  selector: 'app-d5-fiscaliestero',
  templateUrl: './d5-fiscaliestero.component.html',
  styleUrls: ['./d5-fiscaliestero.component.css']
})

export class D5FiscaliesteroComponent extends BaseComponent {

  items: any = null;
  private precontr: UpdD5;
  idins: number;
  convenzioneBilaterale: number;
  story: StoryProcess;

  formAttch = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };

  fields: FormlyFieldConfig[] = [
    {
      wrappers: ['riquadro'],
      templateOptions: {
        title:  this.translateService.instant('d5_intest1')
      },
      fieldGroup: [
        {
          type: 'radio',
          key: 'flag_gestione_separata',
          templateOptions: {
            options: [
              {key: 1, value: this.translateService.instant('d5_txt7')},
              {key: 0, value: this.translateService.instant('d5_txt8')}
            ],
            required: true
          },
        },
        // {
        //   //<p class="mb-0 text-info">{{ 'd5_txt9' | translate }}</p>
        //   template: '<p class="mb-0 text-info">' + this.translateService.instant('d5_txt9') + '</p>'
        // }
      ]
    },
    {
      wrappers: ['riquadro'],
      templateOptions: {
        title:  this.translateService.instant('d5_intest2')
      },
      fieldGroup: [
        {
          type: 'radio',
          key: 'flag_convenzione_bilaterale',
          templateOptions: {
            options: [
              {key: 1, value: this.translateService.instant('d5_a') + ' ' + this.translateService.instant('d5_txt2')},
              {key: 0, value: this.translateService.instant('d5_b') + ' ' + this.translateService.instant('d5_txt3')}
            ],
            required: true,
            translate: true,
            label: this.translateService.instant('d5_txt1'),
          },
          expressionProperties: {
            'templateOptions.options': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.flag_gestione_separata === 1) {
                field.formControl.setValue(0);
                return [{ key: 0, value: this.translateService.instant('d5_b') + ' ' + this.translateService.instant('d5_txt3') }];                
              } else {
                return [
                  {key: 1, value: this.translateService.instant('d5_a') + ' ' + this.translateService.instant('d5_txt2')},
                  {key: 0, value: this.translateService.instant('d5_b') + ' ' + this.translateService.instant('d5_txt3')}
                ];
              }
            }
          },
          defaultValue: this.model.flag_convenzione_bilaterale
        }
      ]

    }
  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private d5Service: D5FiscaliEsteroService,
              private precontrattualeService: PrecontrattualeService,
              protected translateService: TranslateService,
              private storyService: StoryProcessService,
              private tools: InsegnamTools) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        if (!params.get('upd')) {
          this.update = false;
          this.isLoading = true;
          this.d5Service.getPrecontr(+params.get('id')).subscribe(
            response => {
              this.items = response['datiPrecontrattuale'];
              let copy = response['datiPrecontrattuale']['copy'];
              if (copy) {
                this.model = response['datiPrecontrattuale']['copy'];
              }
              this.idins = +params.get('id');
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        } else {
          this.isLoading = true;
          this.d5Service.getDatiFiscaliEstero(+params.get('id')).subscribe(
            response => {
              this.model = response['datiFiscaliEstero'];
              this.items = this.model;
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  saveData(idD5: number) {
    this.isLoading = true;
    if (idD5 === 0) {

      const preStore: IPrecontrStore<any> = {
        insegn_id: this.idins,
        entity: this.model,
      };

      this.newFiscaliEstero(preStore);
    } else {
      this.updateD5(this.model, idD5);
    }
  }

  newFiscaliEstero(fiscali: any) {
    this.d5Service.newDatiFiscaliEstero(fiscali).subscribe(
      response => {
        this.isLoading = false;
        const lastid = response['datiFiscaliEstero']['id']; // RETURN LAST ID
      
        if (response['success']) {
          this.messageService.info('Modello D.5: Dichiarazione ai fini fiscali per i residenti all\'estero creato con successo');
          // AGGIORNA LO SCHEMA PRECONTRATTUALE PASSANDO L'ID DELL'INSEGNAMENTO
          this.precontr = new UpdD5();
          this.precontr.insegn_id = this.idins;
          this.precontr.d5_fiscali_resid_estero_id = lastid;
          this.router.navigate(['home/fiscaliestero/details',  this.precontr.d5_fiscali_resid_estero_id ]);
        } else {
          this.messageService.error(response['message']);
        }
      }
    );
  }

  updateD5(fiscali: any, idD5: number) {
    this.d5Service.updateDatiFiscaliEstero(fiscali, idD5).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello D.5: Dichiarazione ai fini fiscali per i residenti all\'estero aggiornato con successo');
        } else {
          this.messageService.error(response['message']);
        }
        this.router.navigate(['home/fiscaliestero/details', idD5]);
      }
    );
  }


}
