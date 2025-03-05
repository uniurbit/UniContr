import { FormlyFieldConfig, FormlyFormOptions, FormlyTemplateOptions } from '@ngx-formly/core';
import { UserComponent } from '../../user/user.component';
import { Insegnamento, Updp1 } from '../../../classes/insegnamento';
import { InsegnUgov } from '../../../classes/insegn-ugov';
import { InsegnamentoService } from '../../../services/insegnamento.service';
import { Component, OnInit, Output, EventEmitter, NgModule, LOCALE_ID, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { MycurrencyPipe } from './../../../shared/pipe/custom.currencypipe';
import { RouteMetods } from './../../../classes/routeMetods';
import { MessageService, BaseComponent } from './../../../shared';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { InsegnUgovService } from '../../../services/insegn-ugov.service';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';
import { UntypedFormGroup } from '@angular/forms';
import { MyTranslatePipe } from 'src/app/shared/pipe/custom.translatepipe';
import { TranslateService } from '@ngx-translate/core';
import { Page } from 'src/app/shared/lookup/page';

@Component({
  selector: 'app-insegn-detail',
  templateUrl: './insegn-detail.component.html',
  styleUrls: [
    './insegn-detail.component.css'
  ]
})

export class InsegnDetailComponent extends BaseComponent {

  @ViewChild('apri', { static: true }) public apri: TemplateRef<any>;

  item: Insegnamento;
  itemUgov: InsegnUgov;
  itemUpdP1: Updp1;

  translate: MyTranslatePipe;

  formRinnovo = new UntypedFormGroup({});
  fieldRinnovo: FormlyFieldConfig[] = [];
  options: FormlyFormOptions = {
    formState: {
    },
  };

  page = new Page(25);

  // Inline PipeTransform method
  sorgenteRinnovoValue(value: any, prefix: string): string {
    return value ? `Rinnovato da ${value}` : '';
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private insegnamentoService: InsegnamentoService,
    private ugovService: InsegnUgovService,
    public messageService: MessageService,
    public confirmationDialogService: ConfirmationDialogService,
    protected translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    private tools: InsegnamTools,
    private goto: RouteMetods) {
    super(messageService);
    this.translate = new MyTranslatePipe(translateService);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {

    this.fieldRinnovo = [
      {
        fieldGroup: [
          {
            key: 'sorgente_rinnovo',
            type: 'datatablelookup',
            wrappers: ['form-field'],
            validation: {
              show: true
            },
            templateOptions: {
              label: 'Riferimento per il rinnovo',
              columnMode: 'force',
              scrollbarH: true,
              page: this.page,
              hidetoolbar: true,
              footerHeight: 30,
              selected: [],
              selectionType: false,
              selectAllRowsOnPage: false,
              //onDblclickRow: (event) => this.onDblclickRow(event),        
              onSetPage: (pageInfo) => { },
              columns: [
                //il celltemplate va impostato nel ngonint altrimenti è vuoto
                { name: '', prop: 'id', with: 65, maxWidth: 65, cellTemplate: this.apri, sortable: false },
                { name: '#', prop: 'id', width: 80, maxWidth: 100, sortable: false },
                { name: 'Copertura', prop: 'insegnamento.coper_id', width: 100, maxWidth: 100, sortable: false },
                { name: 'Dipartimento', prop: 'insegnamento.dip_cod', width: 100, maxWidth: 150, pipe: this.translate, sortable: false },
                { name: 'Anno', prop: 'insegnamento.aa', width: 100, maxWidth: 150, pipe: this.translate, sortable: false },
                { name: 'Cognome', prop: 'cognome', width: 150, maxWidth: 150, sortable: false },
                { name: 'Nome', prop: 'nome', width: 150, maxWidth: 150, sortable: false },
                { name: 'Motivo Atto', prop: 'insegnamento.motivo_atto', wrapper: 'value', pipe: this.translate, minWidth: 100, maxWidth: 150, sortable: false },
                { name: 'Insegnamento', prop: 'insegnamento.insegnamento', minWidth: 200, width: 450, sortable: false },
                { name: 'SSD', prop: 'insegnamento.cod_settore', width: 100, sortable: false },
                { name: 'CFU', prop: 'insegnamento.cfu', width: 50, sortable: false },
                { name: 'Ore', prop: 'insegnamento.ore', width: 50, sortable: false },
                { name: 'Tipo atto', prop: 'insegnamento.tipo_atto', width: 70, sortable: false },
                { name: 'Numero', prop: 'insegnamento.num_delibera', width: 100, sortable: false },
                { name: '', prop: 'id_sorgente_rinnovo', minWidth: 5, sortable: false, pipe: { transform: this.sorgenteRinnovoValue } },
              ]
            },
            fieldArray: {
              fieldGroup: []
            },
            validators: {
              atleastone: {
                expression: (control, field: FormlyFieldConfig) => {                
                  const idSorgenteRinnovo = field.parent.model.id_sorgente_rinnovo;
                  const motivazioneSorgenteRinnovo = field.parent.model.motivazione_sorgente_rinnovo?.trim();
                  if (idSorgenteRinnovo){
                    return true;
                  }
                  if (motivazioneSorgenteRinnovo){
                    return true;
                  }
                  return false;
                },
                message: (error, field: FormlyFieldConfig) => `Modificare e selezionare una precontrattuale sorgente del rinnovo`,
              },
            },
          },
          {
            key: 'id_sorgente_rinnovo',
            defaultValue: ''
          },
          {
            fieldGroup: [
              {
                key: 'motivazione_sorgente_rinnovo',
                type: 'textarea',
                className: 'col-md-12',
                templateOptions: {                  
                  label: 'Giustificativo',
                  readonly: true,
                  rows: 2,
                  //description: 'Precontrattuale sorgente del rinnovo non in elenco. Si prega di inserire manualmente un giustificativo, indicando l\'eventuale numero del contratto sorgente con il tipo e numero dell\'atto di rinnovo.',
                },
                hideExpression: (model, formState, field) => {
                  return !!field.model.id_sorgente_rinnovo || !field.model.motivazione_sorgente_rinnovo;

                },
              },
            ],

          },
        ],
      }
    ];

    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.insegnamentoService.getInsegnamento(+params.get('id')).subscribe(
          response => {
            if (!response['success']) {
              this.messageService.error(response['message'], true);
            }
            this.item = response['datiInsegnamento']
            if (this.item.sorgente_rinnovo) {
              this.page.totalElements = this.item.sorgente_rinnovo.length; // data.to;
              this.page.pageNumber = 1;
              this.page.size = 25;
            }

          },
          (error) => { this.isLoading = false; },
          () => this.isLoading = false
        );
      }
    );
  }

  rowSelection(row) {
    if (row.insegn_id) {
      // caso particolare mantenuto per compatibilità
      this.router.navigate(['home/summary', row.insegn_id]);
    } else if (row.id) {
      this.router.navigate(['home/summary', row.id]);
    }
  }
  
  gotoP2(idins: number, idP2: number) {
    if (idP2 === 0) {
      this.router.navigate(['home/p2rapporto', idins]);
    } else {
      this.router.navigate(['home/p2rapporto/details', idP2]);
    }
  }

  shouldDisplayRinnovo(): boolean {
    // Check if `motivo_atto_cod` is neither 'APPR_INC' nor 'BAN_INC'
    return this.item && this.item.motivo_atto !== 'APPR_INC' && this.item.motivo_atto !== 'BAN_INC';
  }

  sendEmail() {
    // tslint:disable-next-line:max-line-length
    this.confirmationDialogService.confirm('Conferma', 'Vuoi procedere con l\'invio della richiesta di compilazione della modulistica precontrattuale?')
      .then((confirmed) => {
        if (confirmed) {
          this.isLoading = true;
          this.insegnamentoService.sendFirstEmail(this.item.insegn_id).subscribe(
            response => {
              if (response.success) {
                this.item['sendemailsrcp'].push(response.data);
                this.messageService.info(response.message);
              } else {
                this.messageService.error(response.message);
              }
            },
            (error) => this.isLoading = false,
            () => this.isLoading = false
          );
        }
      });
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }

  updateInsegnamento(insegn_id) {
    this.confirmationDialogService.confirm('Conferma', 'Vuoi procedere con l\'operazione di aggiornamento dei dati?')
      .then((confirmed) => {
        if (confirmed) {
          this.route.paramMap.subscribe(
            (params) => {

              const preStore: IPrecontrStore<any> = {
                insegn_id: insegn_id,
                entity: null,
              };

              this.updateInsegnamentoFromUgov(preStore);
            },
          );
        }
      });
  }

  updateInsegnamentoFromUgov(preStore: IPrecontrStore<any>) {
    this.isLoading = true;
    this.insegnamentoService.updateInsegnamentoFromUgov(preStore).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          //aggiornamento pagina o aggionramento dati
          this.item = { ...this.item, ...response['data'] };
          if (response['message']) {
            this.messageService.warn(response['message']);
          } else {
            this.messageService.info("Parte 1: Dati relativi all'insegnamento aggiornati con successo");
          }

        } else {
          this.messageService.error(response['message']);
        }
      },
      (error) => this.isLoading = false,
      () => this.isLoading = false
    );
  }

  changeCopertura(insegn_id) {
    this.confirmationDialogService.inputConfirm('Cambio', 'Procedere con l\'operazione di cambio?', 'Conferma', 'Annulla', 'sm', null, [
      // motivazione
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'new_coper_id',
            type: 'number',
            className: 'col-md-12',
            templateOptions: {
              required: true,
              label: 'Codice copertura',
            },
          },
        ],
      }
    ])
      .then((confirmed) => {
        if (confirmed.result) {
          const data: IPrecontrStore<any> = {
            insegn_id: this.item.insegn_id,
            entity: confirmed.entity
          };

          this.isLoading = true;
          this.insegnamentoService.changeCoperturaFromUgov(data).subscribe(
            response => {
              this.isLoading = false;
              if (response.success) {
                this.item = { ...this.item, ...response.data };
                this.messageService.info('Operazione di cambio terminata con successo');
              } else {
                this.messageService.error(response.message);
              }
            }
          );
        }
      });
  }

  modificaRinnovo() {
    this.confirmationDialogService.inputConfirm('Modifica', 'Seleziona la precontrattuale riferimento del rinnovo del precedente anno accademico', 'Conferma', 'Annulla', 'lg', null, [
      // motivazione
      {
        wrappers: ['form-field'],
        validation: {
          show: true,
        },
        fieldGroup: [
          {
            fieldGroupClassName: 'row',
            fieldGroup: [
              {
                key: 'id_sorgente_rinnovo',
                className: "col-md-12",
                type: 'external',
                templateOptions: {
                  label: 'Codice precontrattuale rinnovo',
                  type: 'string',
                  entityName: 'precontrattuale',
                  entityLabel: 'Precontrattuali',
                  codeProp: 'id',
                  descriptionProp: 'insegnamento',
                  initdescription: 'insegnamento',
                  description: 'Per rimuovere la selezione, cancellare il codice e premere il tasto Tab.',
                  enableNew: false,
                  descriptionFunc: (data) => {
                    if (data && data.insegnamento) {
                      return data.insegnamento.insegnamento;
                    }
                    return null;
                  },
                  isLoading: false,
                  rules: [],
                },
                hooks: {
                  onInit: (field: FormlyFieldConfig) => {
                    field.formControl.setValue(field.options.formState.extraData.id_sorgente_rinnovo);
                    field.templateOptions.rules = [
                      { value: (+this.item.aa) - 1, field: 'insegnamento.aa', operator: '=', fixcondition: true },
                      { value: this.item.docente_id, field: 'user.v_ie_ru_personale_id_ab', operator: '=', fixcondition: true },
                      { value: this.item.insegnamento, field: 'insegnamento.insegnamento', operator: 'contains' }
                    ]
                  }
                }
                
              },
            ]
          },
          {
            key: 'motivazione_sorgente_rinnovo',
            type: 'textarea',
            className: 'col-md-12',
            templateOptions: {
              label: 'Giustificativo',
              rows: 2,
              description: 'Precontrattuale sorgente del rinnovo non trovata allora si prega di inserire manualmente un giustificativo, indicando l\'eventuale numero del contratto sorgente con il tipo e numero dell\'atto di rinnovo.',
            },
            hideExpression: (model, formState, field) => {
              return !!field.model.id_sorgente_rinnovo;
            },
            hooks: {
              onInit: (field: FormlyFieldConfig) => {
                field.formControl.setValue(field.options.formState.extraData.motivazione_sorgente_rinnovo);
              }
            }
          },
        ],
        validators: {
          atleastone: {
            expression: (control, field: FormlyFieldConfig) => {
              const idSorgenteRinnovo = field.model.id_sorgente_rinnovo;
              const motivazioneSorgenteRinnovo = field.model.motivazione_sorgente_rinnovo?.trim();

              return idSorgenteRinnovo || motivazioneSorgenteRinnovo;
            },
            message: (error, field: FormlyFieldConfig) => `Selezionare una precontrattuale sorgente del rinnovo o eventualmente inserire il giustificativo`,
          },
        },
      }], null, this.item
      )
      .then((confirmed) => {
        if (confirmed.result) {
          const data: IPrecontrStore<any> = {
            insegn_id: this.item.insegn_id,
            entity: {
              ...confirmed.entity,            
            }
          };

          this.isLoading = true;
          this.insegnamentoService.changeRinnovo(data).subscribe(
            response => {
              this.isLoading = false;
              if (response.success) {
                this.item = response['datiInsegnamento']
                if (this.item.sorgente_rinnovo) {
                  this.page.totalElements = this.item.sorgente_rinnovo.length; // data.to;
                  this.page.pageNumber = 1;
                  this.page.size = 25;
                }
    
                this.messageService.info('Operazione di cambio terminata con successo');
              } else {
                this.messageService.error(response.message);
              }
            }
          );
        }
      });
  }



  inserisciManualmente() {
    this.confirmationDialogService.inputConfirm('Inserimento', 'Inserimento manuale del numero dei precedenti insegnamenti', 'Conferma', 'Annulla', 'lg', null, [
      // motivazione
      {
        fieldGroup: [
          {
            key: 'contatore_insegnamenti_manuale',
            type: 'number',
            templateOptions: {
              min: 1,
              required: true,
              label: 'Numero precedenti insegnamenti',
            },
          },
          {
            key: 'motivazione_contatore',
            type: 'textarea',
            templateOptions: {
              rows: 3,
              required: true,
              label: 'Motivazione',
            },
          },
        ],
      }
    ])
      .then((confirmed) => {
        if (confirmed.result) {
          const data: IPrecontrStore<any> = {
            insegn_id: this.item.insegn_id,
            entity: {
              ...confirmed.entity,
              contatore_insegnamenti: this.item.contatore_insegnamenti.counter
            }
          };

          this.isLoading = true;
          this.insegnamentoService.changeContatoreInsegnamentiManuale(data).subscribe(
            response => {
              this.isLoading = false;
              if (response.success) {
                this.item.contatore_insegnamenti_manuale = response.data.contatore_insegnamenti_manuale;
                this.item.motivazione_contatore = response.data.motivazione_contatore;
                this.messageService.info('Operazione di cambio terminata con successo');
              } else {
                this.messageService.error(response.message);
              }
            }
          );
        }
      });
  }

  cancellaContatoreManualmente() {
    const data: IPrecontrStore<any> = {
      insegn_id: this.item.insegn_id,
      entity: {
        contatore_insegnamenti_manuale: null,
        motivazione_contatore: null
      }
    };

    this.isLoading = true;
    this.insegnamentoService.changeContatoreInsegnamentiManuale(data).subscribe(
      response => {
        this.isLoading = false;
        if (response.success) {
          console.log(response.data)
          this.item.contatore_insegnamenti_manuale = response.data.contatore_insegnamenti_manuale;
          this.messageService.info('Operazione di cambio terminata con successo');
        } else {
          this.messageService.error(response.message);
        }
      }
    );
  }


}
