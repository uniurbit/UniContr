import { MessageService, BaseComponent } from './../../../shared';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlHandlingStrategy } from '@angular/router';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { P2rapportoService } from './../../../services/p2rapporto.service';
import { P2rapporto } from './../../../classes/p2rapporto';
// RECUPERA I DATI DELL'INSEGNAMENTO
import { Insegnamento } from '../../../classes/insegnamento';
import { InsegnamentoService } from '../../../services/insegnamento.service';
import { StoryProcessService } from './../../../services/storyProcess.service';

import { Precontrattuale } from './../../../classes/precontrattuale';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { Updp2 } from './../../../classes/precontrattuale';
import { StoryProcess } from './../../../classes/storyProcess';

import { UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';

@Component({
    selector: 'app-p2-posizione-ins',
    templateUrl: './p2-posizione-ins.component.html',
    styleUrls: [
        './p2-posizione-ins.component.css'
    ],
    standalone: false
})

export class P2PosizioneInsComponent extends BaseComponent {

  items: any = null;
  private precontr: Updp2;
  idins: number;
  story: StoryProcess;

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
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'flag_rapp_studio_univ',
          type: 'checkbox',
          className: 'col-auto',
          defaultValue: false,                    
          props: {
            translate: true,
            label: 'p2_check1',
            description: 'Per i titolari di assegno di ricerca, borsa di studio o borsa post-dottorato oppure iscritti ad un corso di Dottorato di Ricerca'
          }
        },
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'flag_dipend_pubbl_amm',
          type: 'checkbox',
          className: 'col-auto',
          defaultValue: false,
          props: {
            translate: true,
            label: 'p2_check2'
          }
        },
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'flag_titolare_pensione',
          type: 'checkbox',
          className: 'col-auto',
          defaultValue: false,
          props: {
            translate: true,
            label: 'p2_check3'
          }
        },
      ]
    }
  ];

  fields2: FormlyFieldConfig[] = [
    {
      type: 'radio',
      key: 'natura_rapporto',
      props: {
        options: [],
        required: true,
        label: 'Sezionare una opzione'
      },
      expressionProperties: {
        'props.options': (model: any, formState: any, field: FormlyFieldConfig) => {
          const opt =  [{ value: 'PRPR', label: this.translateService.instant('p3_radio1') }];

          if (this.tools.controlloCNA(this.items.tipo_contratto, this.items.ore)) {
            opt.push({ value: 'COCOCO', label: this.translateService.instant('p3_radio2') });
          }

          if (this.tools.controlloPLAO(this.items.tipo_contratto, this.items.ore)) {
            opt.push( { value: 'PLAO', label: this.translateService.instant('p3_radio3') });
          }

          opt.push( { value: 'PTG', label: this.translateService.instant('p3_radio4') });
          opt.push( { value: 'ALD', label: this.translateService.instant('p3_radio5') });
          return opt;
        },
        'props.description': (model: any, formState: any, field: FormlyFieldConfig) => {
          switch (model.natura_rapporto) {
            case 'PRPR': {
               return this.translateService.instant('p3_PRPR');
            }
            case 'PLAO': {
               return this.translateService.instant('p3_PLAO');
            }
            case 'PTG': {
              return this.translateService.instant('p3_PTG');
            }
            case 'ALD': {
              return this.translateService.instant('p3_ALD');
            }
            default: {
               return '';
            }
          }
        }
      },
      
      // validators: {
      //   compatibility: ctrl => ctrl.value == 'ALD' ? ['CD', 'CL','ND','NM','NE'].includes(this.items.ruolo) : true 
      // },
      // validation: {
      //   messages: {
      //     compatibility: 'Scelta non compatibile con il ruolo',
      //   }
      // },
    },
    //messaggio di avvertimento commentato nel caso di edit e modifica natura del rapporto
    // {      
    //   template: '<p class="text-muted">La modifica del campo "Natura del Rapporto" richiede una verifica della compilazione dei riquadri economici</p>',
    //   hideExpression(model, formState, field?) {
    //     //nascondi se non c'è id oppure se c'è id e il campo è pristine
    //     return !!!model.p2_natura_rapporto_id || (!!model.p2_natura_rapporto_id && field.form.get('natura_rapporto').pristine); 
    //   },      
    // },
  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private p2rapportoService: P2rapportoService,
              private insegnamentoService: InsegnamentoService,
              private precontrattualeService: PrecontrattualeService,
              private storyService: StoryProcessService,
              protected translateService: TranslateService,
              public messageService: MessageService,              
              private tools: InsegnamTools) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        if (!params.get('upd')) {
          this.update = false;
          this.messageService.clear();
          this.isLoading = true;
          this.insegnamentoService.getInsegnamento(+params.get('id')).subscribe(
            response => {
              this.items = response['datiInsegnamento'];
              this.idins = +params.get('id');
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        } else {
          this.isLoading = true;
          this.p2rapportoService.getRapporto(+params.get('id')).subscribe(
            response => {
              this.model = response['datiRapporto'];
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

  saveData(idP2: number) {
    // console.log(this.formAttch.value);
    // console.log(this.model);
    if (idP2 === 0) {
      this.newRapporto(this.model);
    } else {
      this.updateP2(this.model, idP2);
    }
  }

  newRapporto(rapporto) {
    this.isLoading = true;
    rapporto['insegn_id'] = this.idins;
    this.p2rapportoService.newRapporto(rapporto).subscribe(
      response => {
        this.isLoading = false;        
        if (response['success']) {
          const lastid = response['data']['id']; // RETURN LAST ID
          this.messageService.info('Parte 2: Posizione del collaboratore creata con successo');
          this.router.navigate(['home/p2rapporto/details', lastid]);        
        } else {
          this.messageService.error(response['message']);
        }      
      },
      (error) => this.handleError(error),      
    );
  }


  updateP2(rapporto: P2rapporto, idP2: number) {

    const preStore: IPrecontrStore<P2rapporto> = {
      insegn_id: this.idins,
      entity: rapporto,
    };
    this.isLoading = true;
    this.p2rapportoService.updateRapporto(preStore, idP2).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Parte 2: Posizione del collaboratore aggiornata con successo');
          this.router.navigate(['home/p2rapporto/details', idP2]);          
        } else {
          this.messageService.error(response['message']);
        }
        
      },
      (error) => this.handleError(error),
      () => this.complete()
    );
  }

}
