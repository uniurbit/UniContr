import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { UpdE } from './../../../classes/precontrattuale';
import { EOccasionale } from './../../../classes/eOccasionale';
import { EOccasionaleService } from './../../../services/eOccasionale.service';

import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { encode, decode } from 'base64-arraybuffer';

@Component({
  selector: 'app-e-occasionale',
  templateUrl: './e-occasionale.component.html',
  styleUrls: ['./e-occasionale.component.css']
})
export class EOccasionaleComponent extends BaseComponent {

  items: any = null;
  private precontr: UpdE;
  idins: number;

  gestioni: Array<Object> = [
    {gestione: '', name: ''},
    {gestione: '002', name: '002 : Pensionati di tutti gli Enti pensionistici obbligatori', group: 'Pensionati'},
    {gestione: '101', name: '101 : Fondo Pensioni Lavoratori Dipendenti', group: 'INPS'},
    {gestione: '102', name: '102 : Artigiani', group: 'INPS'},
    {gestione: '103', name: '103 : Commercianti', group: 'INPS'},
    {gestione: '104', name: '104 : Coltivatori diretti, mezzadri e coloni', group: 'INPS'},
    {gestione: '105', name: '105 : Versamenti volontari', group: 'INPS'},
    {gestione: '106', name: '106 : Versamenti Figurativi (CIG, ecc...)', group: 'INPS'},
    {gestione: '107', name: '107 : Fondi speciali', group: 'INPS'},
    {gestione: '201', name: '201 : Dipendenti Enti Locali e Amministrazioni dello Stato', group: 'EX INPDAP'},
    {gestione: '301', name: '301 : Dottori commercialisti', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '302', name: '302 : Ragionieri', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '303', name: '303 : Ingegneri e Architetti', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '304', name: '304 : Geometri', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '305', name: '305 : Avvocati', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '306', name: '306 : Consulenti del lavoro', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '307', name: '307 : Notai', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '308', name: '308 : Medici', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '309', name: '309 : Farmacisti', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '310', name: '310 : Veterinari', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '311', name: '311 : Chimici', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '312', name: '312 : Agronomi', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '313', name: '313 : Geologi', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '314', name: '314 : Attuari', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '315', name: '315 : Infermieri professionali, Ass. sanitari, Vigilatrici infanzia', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '316', name: '316 : Psicologi', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '317', name: '317 : Biologi', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '318', name: '318 : Periti industriali', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '319', name: '319 : Agrotecnici, Periti agrari', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '320', name: '320 : Giornalisti (INPGI)', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '321', name: '321 : Spedizionieri', group: 'Casse Previdenziali Professionisti Autonomi'},
    {gestione: '401', name: '401 : Dirigenti d\'azienda', group: 'EX INPDAI'},
    {gestione: '501', name: '501 : Lavoratori dello spettacolo', group: 'ENPALS'},
    {gestione: '601', name: '601 : Lavoratori Poste Italiane S.p.A.', group: 'IPOST'}
  ];

  formAttch = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };

  fields1: FormlyFieldConfig[] = [
    {
      fieldGroup: [
        {
          type: 'radio',
          key: 'cod_limite_reddito',
          templateOptions: {
            options: [
              {key: 'NASL', value: this.translateService.instant('e_txt1')},
              {key: 'AGR', value: this.translateService.instant('e_txt2')},
              {key: 'ASLR', value: this.translateService.instant('e_txt4')}
            ],
            required: true,
          },
        }
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'importo',
          type: 'maskcurrency',
          className: 'col-md-4',
          templateOptions: {
            translate: true,
            label: 'e_txt3',
            required: true
          }
        }
      ],
      hideExpression: (model: any, formState: any) => {
        if (model.cod_limite_reddito !== 'AGR') {
          return model;
        }
      },
    },
  ];

  fields2: FormlyFieldConfig[] = [
    {
      fieldGroup: [
        {
          type: 'radio',
          key: 'gestione_separata',
          templateOptions: {
            options: [
              {key: 1, value: this.translateService.instant('e_txt5')},
              {key: 6, value: this.translateService.instant('e_txt6')},
              {key: 2, value: this.translateService.instant('e_txt7')},
              {key: 3, value: this.translateService.instant('e_txt8')},
              {key: 4, value: this.translateService.instant('e_txt9')},
              {key: 5, value: this.translateService.instant('e_txt10')}
            ],
            translate: true,
            label: 'e_premessa2',
            required: true
          },
        }
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        /*
        {
          key: 'previdenza',
          type: 'input',
          className: 'col-md-6',
          templateOptions: {
            translate: true,
            label: 'e_label1',
            required: true
          }
        },
        */
        {
          key: 'cod_cassa_previdenziale',
          type: 'select',
          className: 'col-md-6',
          templateOptions: {
            options: this.gestioni,
            valueProp: 'gestione',
            labelProp: 'name',
            label: this.translateService.instant('e_label2'),
            required: true,
          }
        }
      ],
      hideExpression: (model: any, formState: any) => {
        if (model.gestione_separata !== 1) {
          return model;
        }
      },
    }
  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private occasionaleService: EOccasionaleService,
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
          this.occasionaleService.getPrecontr(+params.get('id')).subscribe(
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
          this.occasionaleService.getOccasionale(+params.get('id')).subscribe(
            response => {
              this.model = response['datiModelloE'];
              this.items = this.model;
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  saveData(idE: number) {
    this.isLoading = true;
    if (idE === 0) {
      this.newOccasionale(this.model);
    } else {
      this.updateE(this.model, idE);
    }
  }

  newOccasionale(occas: any) {
    this.occasionaleService.newOccasionale(occas).subscribe(
      response => {
        this.isLoading = false;
        const lastid = response['datiModelloE']['id']; // RETURN LAST ID

        if (response['success']) {
          this.messageService.info('Modello E: Prestazione di Lavoro Autonomo Occasionale creato con successo');
          // AGGIORNA LO SCHEMA PRECONTRATTUALE PASSANDO L'ID DELL'INSEGNAMENTO
          this.precontr = new UpdE();
          this.precontr.insegn_id = this.idins;
          this.precontr.e_autonomo_occasionale_id = lastid;
          this.updatePrecontr(this.precontr);
        } else {
          this.messageService.error(response['message']);
        }
      }
    );
  }

  updatePrecontr(precontr) {
    this.isLoading = false;
    this.precontrattualeService.updatePrecontr(precontr).subscribe(
      response => {
        if (response['success']) {
          this.messageService.info('Schema precontrattuale aggiornato con successo', false);
          this.router.navigate(['home/occasionale/details',  this.precontr.e_autonomo_occasionale_id ]);
        } else {
          this.messageService.error(response['message']);
        }
      }
    );
  }

  updateE(occas: any, idE: number) {
    // console.log(prestaz);
    this.occasionaleService.updateOccasionale(occas, idE).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello E: Prestazione di Lavoro Autonomo Occasionale aggiornato con successo');
        } else {
          this.messageService.error(response['message']);
        }
        this.router.navigate(['home/occasionale/details', idE]);
      }
    );
  }

}
