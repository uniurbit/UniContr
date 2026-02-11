
import { NgForm, UntypedFormGroup } from '@angular/forms';
import { Component, OnInit, NgModule, LOCALE_ID, Input, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MycurrencyPipe } from './../../../shared/pipe/custom.currencypipe';
import { InsegnamTools } from './../../../classes/insegnamTools';

import { InsegnUgov } from './../../../classes/insegn-ugov';
import { Insegnamento } from './../../../classes/insegnamento';
import { Precontrattuale } from './../../../classes/precontrattuale';
import { Docente } from './../../../classes/docente';
import { RuoloDocente } from './../../../classes/ruoloDocente';

import { InsegnUgovService } from './../../../services/insegn-ugov.service';
import { InsegnamentoService } from './../../../services/insegnamento.service';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { MessageService, BaseComponent } from './../../../shared';
import { DocenteService } from './../../../services/docente.service';
import { RuoloDocenteService } from './../../../services/ruoloDocente.service';
import { InsegnamentoInterface } from 'src/app/interface/insegnamento';
import { IPrecontrattuale } from 'src/app/interface/precontrattuale';
import { StoryProcess } from './../../../classes/storyProcess';
import { TitleCasePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MyTranslatePipe } from 'src/app/shared/pipe/custom.translatepipe';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Page } from 'src/app/shared/lookup/page';

@Component({
    selector: 'app-insegn-ugov-detail',
    templateUrl: './insegn-ugov-detail.component.html',
    styles: [],
    standalone: false
})

export class InsegnUgovDetailComponent extends BaseComponent {

  @ViewChild('apri', { static: true }) public apri: TemplateRef<any>;

  private __ins: Insegnamento;

  @Input()
  set ins(ins: Insegnamento) {
    this.__ins = ins;
  }

  get ins() {
    return this.__ins;
  }

  item: InsegnUgov;
  private precontr: Precontrattuale;
  private docente: Docente;
  private ruoloDocente: RuoloDocente;
  public modelid: number;
  checkTutor: boolean;
  checkIns: boolean;
  story: StoryProcess;


  translate: MyTranslatePipe;

  formContrattiPrecedenti = new UntypedFormGroup({});
  fieldContrattiPrecedenti: FormlyFieldConfig[] = [];
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
    private insegnUgovService: InsegnUgovService,
    private insegnamentoService: InsegnamentoService,
    private precontrattualeService: PrecontrattualeService,
    private docenteService: DocenteService,
    private ruoloDocenteService: RuoloDocenteService,
    protected translateService: TranslateService,
    private cdr: ChangeDetectorRef,
    messageService: MessageService,
    private tools: InsegnamTools) {
    super(messageService);

    this.translate = new MyTranslatePipe(translateService);



  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    //informazioni importanti per determinare il rinnovo 
    //(epigrafe, settore scientifico disciplinare, CFU, ore di didattica frontale) 
    this.fieldContrattiPrecedenti = [
      {
        fieldGroup: [
          {
            key: 'contratti_precedenti',
            type: 'datatablelookup',
            wrappers: ['form-field'],
            props: {
              label: 'Seleziona la precontrattuale di riferimento per il rinnovo',
              columnMode: 'force',
              scrollbarH: true,
              page: this.page,
              hidetoolbar: true,
              footerHeight: 30,
              selected: [],
              selectionType: "checkbox",
              selectAllRowsOnPage: false,
              onSelect: (field: FormlyFieldConfig, selected) => {
                const control = field.form.get('id_sorgente_rinnovo');
                // Set the control value based on selected items
                control.setValue(
                  (Array.isArray(selected) && selected.length > 0 && selected[0]?.id) || null
                );
              },
              displayCheck: (row) => {
                //visualizza il checkbox solo se la precontrattuale non è già stata riferita
                return !!row.is_not_referred;
              },
              //onDblclickRow: (event) => this.onDblclickRow(event),        
              onSetPage: (pageInfo) => { },
              columns: [
                { with: 50, maxWidth: 50, headerCheckboxable: false, checkboxable: true, sortable: false },
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
                { name: 'Partizione', prop: 'insegnamento.part_stud_des', minWidth: 150, maxWidth: 250, sortable: false },
                { name: 'Codice attività formativa', prop: 'insegnamento.cod_insegnamento', minWidth: 150, maxWidth: 250, sortable: false },            
                { name: 'Numero', prop: 'insegnamento.num_delibera', width: 100, sortable: false },
                { name: 'Sorgente per', prop: 'sorgente_rinnovo_per_id', minWidth: 5, sortable: false },
                { name: 'Rinnovato da', prop: 'id_sorgente_rinnovo', minWidth: 5, sortable: false },
                  
              ]
            },
            fieldArray: {
              fieldGroup: []
            },
            hooks: {
              onInit: (field: FormlyFieldConfig) => {
                const notReferredRows = field.model.filter(row => row.is_not_referred);
                if (notReferredRows.length === 1) {
                  field.props.selected = [notReferredRows[0]];
                  field.form.get('id_sorgente_rinnovo').setValue((notReferredRows[0]?.id) || null);
                  field.formControl.markAllAsTouched();
                  field.formControl.updateValueAndValidity();
                  this.cdr.detectChanges();
                } else if (notReferredRows.length === 0){
                  field.form.get('flag_non_trovato').setValue(true);
                }                    
                
              }
            },
            validators: {
              atleastone: {
                expression: (control, field: FormlyFieldConfig) => {
                  const hasNotReferred = (field.model || []).some(row => row.is_not_referred);
                  const selectedLength = field.props.selected.length;
                  if (!!field.parent.parent.model.flag_non_trovato){
                    return true;
                  }
                  return !hasNotReferred || selectedLength === 1;

                },
                message: (error, field: FormlyFieldConfig) => `Selezionare un insegnamento`,
              },
            },
          },
          {
            key: 'id_sorgente_rinnovo',
            defaultValue: ''
          },
          {
            type: 'checkbox',
            key: 'flag_non_trovato',
            defaultValue: false,
            props: {
              label: 'Precontrattuale sorgente del rinnovo non in elenco',
              formCheck: 'switch',
           
            },            
            hideExpression: (model, formState, field) => {
              return !!field.model.id_sorgente_rinnovo;
              //const contrattiPrecedenti = field.model.contratti_precedenti || [];
              //return contrattiPrecedenti.some(row => row.is_not_referred);
            },
            expressionProperties: {
              'props.disabled': (model) => {
                const contrattiPrecedenti = model.contratti_precedenti || [];
                return contrattiPrecedenti.some(row => row.is_not_referred) == 0;
              },
            }
          },
          {
            fieldGroup: [
              // {
              //   fieldGroupClassName: 'row',
              //   fieldGroup: [
              //     {
              //       key: 'select_id_sorgente_rinnovo',
              //       className: "col-md-12",
              //       type: 'external',
              //       props: {
              //         label: 'Selezionare precontrattuale di rinnovo',
              //         type: 'string',
              //         entityName: 'precontrattuale',
              //         entityLabel: 'Precontrattuali',
              //         codeProp: 'id',
              //         descriptionProp: 'insegnamento',
              //         initdescription: 'insegnamento',
              //         enableNew: false,
              //         descriptionFunc: (data) => {
              //           if (data && data.insegnamento) {
              //             return data.insegnamento.insegnamento;
              //           }
              //           return null;
              //         },
              //         isLoading: false,
              //         rules: [],
              //       },
              //       hooks: {
              //         onInit: (field: FormlyFieldConfig) => {
              //           field.props.rules = [
              //             { value: (+this.item.aa_off_id) - 1, field: 'insegnamento.aa', operator: '=', fixcondition: true },
              //             { value: this.item.id_ab, field: 'user.v_ie_ru_personale_id_ab', operator: '=', fixcondition: true }
              //           ]
              //         }
              //       }
              //     },
              //   ]
              // },
              {
                key: 'motivazione_sorgente_rinnovo',
                type: 'textarea',
                className: 'col-md-12',
                props: {
                  required: true,
                  label: 'Giustificativo',
                  rows: 3,
                  description: 'Precontrattuale sorgente del rinnovo non in elenco. Si prega di inserire manualmente un giustificativo, indicando l\'eventuale numero del contratto sorgente con il tipo e numero dell\'atto di rinnovo.',
                },
              },
            ],
            hideExpression: (model, formState, field) => {
              return !!field.model.id_sorgente_rinnovo || !!!field.model.flag_non_trovato;
               
              const contrattiPrecedenti = field.model.contratti_precedenti || [];
              return contrattiPrecedenti.some(row => row.is_not_referred);
            },
          },

        ],

      }

    ];

    this.messageService.clear();
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.insegnUgovService.getInsegnamentoUgov(+params.get('coper_id'), params.get('aa_off_id')).subscribe(
          response => {
            this.item = response['datiUgov'];

            if (this.item.contratti_precedenti) {
              this.page.totalElements = this.item.contratti_precedenti.length; // data.to;
              this.page.pageNumber = 1;
              this.page.size = 25;
            }

          },
          (error) => this.handleError(error),
          () => this.complete()
        );

      }
    );
  }


  shouldDisplayFormPrecontrattualiPrecedenti(): boolean {
    // Check if `motivo_atto_cod` is neither 'APPR_INC' nor 'BAN_INC'
    return this.item && this.item.contratti_precedenti && this.item.motivo_atto_cod !== 'APPR_INC' && this.item.motivo_atto_cod !== 'BAN_INC';
  }

  rowSelection(row) {
    if (row.insegn_id) {
      // caso particolare mantenuto per compatibilità
      this.router.navigate(['home/summary', row.insegn_id]);
    } else if (row.id) {
      this.router.navigate(['home/summary', row.id]);
    }
  }

  onDblclickRow(event) {
  }

  email(email: string, e_mail: string, e_mail_privata: string) {
    let value = '';
    if (email === '%@uniurb.it%') {
      value = email;
    } else if (e_mail === '%@uniurb.it%') {
      value = e_mail;
    } else if (email !== '%@uniurb.it%') {
      value = email;
    } else if (e_mail !== '%@uniurb.it%') {
      value = e_mail;
    } else if (e_mail_privata !== '') {
      value = e_mail_privata;
    }
    return value;
  }

  checkEmail(email: string, e_mail: string, e_mail_privata: string) {
    let value = false;
    if (email !== null) {
      if (email.toLowerCase().includes('@uniurb.it')) {
        value = true;
      }
    } else if (e_mail !== null) {
      if (e_mail.toLowerCase().includes('@uniurb.it')) {
        value = true;
      }
    } else if (e_mail_privata !== null) {
      if (e_mail_privata.toLowerCase().includes('@uniurb.it')) {
        value = true;
      }
    } else {
      value = false;
    }
    return value;
  }

  datoMancante(value: string) {
    if (value === '') {
      return 'NULL';
    } else {
      return value;
    }
  }

  counterInsegnamenti(cod_ins, fiscal_code) {

    // copertura/{coper_id}/contatore/{cf}z
  }

  // Method to process and modify form data
  processFormData(formData: any): any {

    const modifiedData = { ...formData }; // Clone the form data

    // Remove 'contratti_precedenti' from the modifiedData object
    delete modifiedData.contratti_precedenti;

    // Return the modified data
    return modifiedData;
  }

  saveIns(data, nome: string, cognome: string, cf: string, id_ab: number, email: string) {
    if (data) {
      let tcp = new TitleCasePipe();
      const pre: IPrecontrattuale = {
        insegnamento: data,
        docente: {
          name: tcp.transform(nome) + ' ' + tcp.transform(cognome),
          nome: tcp.transform(nome),
          cognome: tcp.transform(cognome),
          cf: cf,
          email: email.toLowerCase(),
          v_ie_ru_personale_id_ab: id_ab,
          password: null,
        }
      };

      if (this.shouldDisplayFormPrecontrattualiPrecedenti()) {
        // Add information about id_sorgente_rinnovo and motivazione_sorgente_rinnovo
        pre.precontrattuale_sorgente = this.processFormData(this.formContrattiPrecedenti.value);
      }

      this.newPrecontrImportInsegnamento(pre);
    } else {
      this.messageService.error('Spiacente, nessun parametro passato');
    }
  }

  newPrecontrImportInsegnamento(pre: IPrecontrattuale) {
    this.isLoading = true;
    this.precontrattualeService.newPrecontrImportInsegnamento(pre).subscribe(
      response => {
        this.isLoading = false;
        if (response.success) {
          this.messageService.info('Insegnamento ' + pre.insegnamento.coper_id + ' inserito con successo');
          this.router.navigate(['home/detail-insegn', response.data.insegnamento.id]);
        } else {
          this.messageService.error(response.message);
        }
      }
    );
  }


}
