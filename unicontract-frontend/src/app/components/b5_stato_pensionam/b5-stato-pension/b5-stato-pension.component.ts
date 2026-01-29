import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { StoryProcessService } from './../../../services/storyProcess.service';

import { Updb5 } from './../../../classes/precontrattuale';
import { B5StatoPensionamento } from './../../../classes/b5statoPensionamento';
import { B5StatoPensionamentoService } from './../../../services/b5statoPensionam.service';

import { UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import ControlUtils from 'src/app/shared/dynamic-form/control-utils';
import { Observable, of, Subject } from 'rxjs';
import { StoryProcess } from './../../../classes/storyProcess';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';


@Component({
    selector: 'app-b5-stato-pension',
    templateUrl: './b5-stato-pension.component.html',
    styleUrls: ['./b5-stato-pension.component.css'],
    standalone: false
})
export class B5StatoPensionComponent extends BaseComponent {

  items: any = null; // B5StatoPensionamento;

  private precontr: Updb5;
  idins: number;
  story: StoryProcess;
  update: boolean = true;

  formAttch = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };




  fields1: FormlyFieldConfig[] = [
    {
      type: 'radio',
      key: 'status',
      props: {
        options: [],
        required: true,
      },
      expressionProperties: {
        'props.label': () => this.translateService.instant('b5_txt1', { s: ControlUtils.genderTranslate(this.items.sesso) }),
        'props.options': () =>
          [
            { value: 'PNDA', label: this.translateService.instant('b5_txt2',  { s: ControlUtils.genderTranslate(this.items.sesso) }) },
            { value: 'CSPA', label: this.translateService.instant('b5_txt3',  { s: ControlUtils.genderTranslate(this.items.sesso) }) },
            { value: 'CVPA', label: this.translateService.instant('b5_txt4',  { s: ControlUtils.genderTranslate(this.items.sesso) }) },
            { value: 'RURL', label: this.translateService.instant('b5_txt5',  { s: ControlUtils.genderTranslate(this.items.sesso) }) },
          ]                      
      },
      validators: {
        compatibility: ctrl => this.items.natura_rapporto == 'ALD' ? ctrl.value != 'CSPA' : true 
      },
      validation: {
        messages: {
          compatibility: 'Scelta non compatibile con rapporto: '+this.translateService.instant('p3_radio5'),
        }
      },
    },
  ];

  fields2: FormlyFieldConfig[] = [
    {
      template: '<div class="mb-1">' + this.translateService.instant('b5_txt6') + '</div>'
    },
    {
      key: 'flag_rapp_collab_universita',
      type: 'checkbox',
      defaultValue: false,
      props: {
        translate: true,
        label: 'b5_txt7'
      }
    },
  ];

  fields: FormlyFieldConfig[] = [   
    {
      wrappers: ['riquadro'],
      fieldGroup: this.fields1
    },
    {
      wrappers: ['riquadro'],
      fieldGroup: this.fields2
    }
  ]

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private statoPensionamService: B5StatoPensionamentoService,
              private precontrattualeService: PrecontrattualeService,
              private storyService: StoryProcessService,
              protected translateService: TranslateService,
              private tools: InsegnamTools) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    // this.items = new B5StatoPensionamento();
    this.route.paramMap.subscribe(
      (params) => {
        if (!params.get('upd')) {
          this.update = false;
          this.isLoading = true;
          this.statoPensionamService.getPrecontr(+params.get('id')).subscribe(
            response => {
              this.items = response['datiPrecontrattuale'];
              this.idins = +params.get('id');
              let copy = response['datiPrecontrattuale']['copy'];
              if (copy) {
                this.model = response['datiPrecontrattuale']['copy'];
              }
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        } else {
          this.isLoading = true;
          this.statoPensionamService.getStatoPension(+params.get('id')).subscribe(
            response => {
              this.model = response['datiStatoPensionam'];
              this.items = this.model;
              this.idins = this.model['insegn_id'];
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  saveData(idB5: number) {
    // console.log(this.formAttch.value);
    // console.log(this.model);
    this.isLoading = true;
    if (idB5 === 0) {

      const preStore: IPrecontrStore<any> = {
        insegn_id: this.idins,
        entity: this.model,
      };
      
      this.newStatoPensionam(preStore);
    } else {
      this.updateB5(this.model, idB5);
    }
  }

  newStatoPensionam(pensionam) {
    
    this.statoPensionamService.newStatoPensionam(pensionam).subscribe(
      response => {
        this.isLoading = false;
        const lastid = response['datiStatoPensionam']['id']; // RETURN LAST ID

        if (response['success']) {
          this.messageService.info('Quadro B.5: Stato di pensionamento creato con successo');
          // AGGIORNA LO SCHEMA PRECONTRATTUALE PASSANDO L'ID DELL'INSEGNAMENTO
          this.precontr = new Updb5();
          this.precontr.insegn_id = this.idins;
          this.precontr.b5_stato_pensionam_id = lastid;  
          this.router.navigate(['home/pension/details', this.precontr.b5_stato_pensionam_id]);        
        } else {
          this.messageService.error(response['message']);
        }
        
      }
    );
  }


  updateB5(pensionam: B5StatoPensionamento, idB5: number) {
    this.statoPensionamService.updateStatoPensionam(pensionam, idB5).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Quadro B.5: Stato di pensionamento aggiornato con successo');
        } else {
          this.messageService.error(response['message']);
        }        
        this.router.navigate(['home/pension/details', idB5]);
      }
    );
  }

}
