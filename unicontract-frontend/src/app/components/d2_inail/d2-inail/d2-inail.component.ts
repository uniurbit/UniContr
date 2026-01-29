import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { UpdD2 } from './../../../classes/precontrattuale';
import { D2Inail } from './../../../classes/d2Inail';
import { D2InailService } from './../../../services/d2Inail.service';

import { UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { encode, decode } from 'base64-arraybuffer';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';
import { D2InailInterface } from 'src/app/interface/d2Inail.interface';

@Component({
    selector: 'app-d2-inail',
    templateUrl: './d2-inail.component.html',
    styleUrls: ['./d2-inail.component.css'],
    standalone: false
})
export class D2InailComponent extends BaseComponent {

  items: any = null;
  private precontr: UpdD2;
  idins: number;

  formAttch = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };

  fields: FormlyFieldConfig[] = [
    {
      fieldGroup: [
        {
          template: '<h5>' + this.translateService.instant('d2_title2') + '</h5>'
        },
        {
          type: 'radio',
          key: 'posizione_previdenziale',
          props: {
            options: [
              {value: 'INAIL7',  label: this.translateService.instant('d2_txt2')},
              {value: 'INAIL10', label: this.translateService.instant('d2_txt3')},
              {value: 'INAIL4',  label: this.translateService.instant('d2_txt4')},
              {value: 'NOINAIL', label: this.translateService.instant('d2_txt5')}
            ],
            required: true,
            translate: true,
            label: 'd2_txt1'
          },
          expressionProperties: {
            'props.description': (model: any, formState: any, field: FormlyFieldConfig) => {
              if (model.posizione_previdenziale === 'INAIL7') {
                 return this.translateService.instant('d2_sub_txt1');
              } else if (model.posizione_previdenziale === 'INAIL10') {
                return this.translateService.instant('d2_sub_txt2');
              } else if (model.posizione_previdenziale === 'INAIL4') {
                return this.translateService.instant('d2_sub_txt3');
              } else {
                return '';
              }
            }
          }
        }
      ]
    },
  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private d2inailService: D2InailService,
              private precontrattualeService: PrecontrattualeService,
              protected translateService: TranslateService,
              private tools: InsegnamTools) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        if (!params.get('upd')) {
          this.update = false;
          this.isLoading = true;
          this.d2inailService.getPrecontr(+params.get('id')).subscribe(
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
          this.d2inailService.getInail(+params.get('id')).subscribe(
            response => {
              this.model = response['datiInail'];
              this.items = this.model;
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  saveData(idD2: number) {    
    if (idD2 === 0) {
      this.isLoading = true;
      const toStore: IPrecontrStore<D2InailInterface> = {
        insegn_id: this.idins,
        entity: this.model,
      };
      this.d2inailService.newInail(toStore).subscribe(
        response => {
          this.isLoading = false;
          const lastid = response['datiInail']['id']; // RETURN LAST ID
  
          if (response['success']) {
            this.messageService.info('Modello D.2: Dichiarazione ai fini assicurativi INAIL creato con successo');
            // AGGIORNA LO SCHEMA PRECONTRATTUALE PASSANDO L'ID DELL'INSEGNAMENTO
            this.precontr = new UpdD2();
            this.precontr.insegn_id = this.idins;
            this.precontr.d2_inail_id = lastid;
            this.router.navigate(['home/inail/details',  this.precontr.d2_inail_id ]);
          }else{
            this.messageService.error(response['message']);
          }
        });
    } else {
      this.updateD2(this.model, idD2);
    }
  }

  updateD2(inail: any, idD2: number) {
    // console.log(prestaz);
    this.isLoading = true;
    this.d2inailService.updateInail(inail, idD2).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello D.2: Dichiarazione ai fini assicurativi INAIL aggiornato con successo');
          this.router.navigate(['home/inail/details', idD2]);
        } else {
          this.messageService.error(response['message']);
        }
       
      }
    );
  }

}
