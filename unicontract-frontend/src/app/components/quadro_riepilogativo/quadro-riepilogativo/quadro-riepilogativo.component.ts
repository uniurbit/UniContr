import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { SummaryService } from './../../../services/quadro-riepilogativo.service';
import { RouteMetods } from './../../../classes/routeMetods';
import { encode, decode } from 'base64-arraybuffer';

import { UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { B1ConflittoService } from 'src/app/services/b1conflitto.service';
import { EmailListService } from 'src/app/services/emailList.service';
import { SendEmail } from './../../../classes/sendEmail';
import { StoryProcessService } from './../../../services/storyProcess.service';
import { StoryProcess } from './../../../classes/storyProcess';
import { NgxPermissionsService } from 'ngx-permissions';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { NotificaService } from 'src/app/shared/notifica.service';
import { AppConstants } from 'src/app/app-constants';
import { AuthService } from 'src/app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastService } from 'src/app/shared/toast-service';
import { saveAs } from 'file-saver';
import { BreadcrumbService } from 'src/app/services/breadcrumb.service';
import { UserComponent } from '../../user/user.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicModalComponent } from 'src/app/shared/dynamic-modal/dynamic-modal.component';
//import { IOSignElement } from 'src/assets/js/io-sign.js';

//importata dalla lib js api-client-lib di U-Sign
declare var SDK: any;
@Component({
    selector: 'app-quadro-riepilogativo',
    templateUrl: './quadro-riepilogativo.component.html',
    styleUrls: ['./quadro-riepilogativo.component.css'],
    standalone: false
})

export class QuadroRiepilogativoComponent extends BaseComponent implements AfterViewInit {

  public firmaio: ElementRef;
  @ViewChild('btnfirmaio') set setfirmaio(content: ElementRef) {
    this.firmaio = content;
    if (this.firmaio) {
      this.firmaio.nativeElement.addEventListener("io-sign.cta.click", this.eventListener);
    }
  };

  private eventListener = async () => {

    const data: IPrecontrStore<any> = {
      insegn_id: this.idins,
      entity: {}
    };

    //chiamata per la richiesta di firma con app IO ... 
    this.summaryService.richiestafirmaio(data).subscribe(
      response => {
        this.isLoading = false;
        if (response.success) {
          this.messageService.clear();
          if (response.message) {
            this.messageService.info(response.message);
          }

          if (response.data.validazioni) {
            //se restituisce la tabella validazioni aggiorno la precontrattuale e esco          
            this.items = { ...this.items, ...response.data.validazioni };
            this.items.attachments = response.data.attachments;
            this.sessionStorageService.removeItem('visualizzaContratto' + this.items.id);
            this.messageService.info('Operazione firma contratto terminata con successo');
          } else {

            if (response.data.stato == 'WAIT_FOR_QTSP') {
              this.firmaio.nativeElement.reset();
              const msg = "Siamo in attesa che venga completato il processo di firma dal fornitore del servizio. Riprovare più tardi."
              this.confirmationDialogService.confirm('Firma con IO', msg, null, 'Chiudi', 'lg').then((confirmed) => { }, () => { });

            } else {
              //visualizza il QR
              this.items.firmaUtente = response.data;
              this.firmaio.nativeElement.redirectOrShowQrCode(response.data.signature_request_id);
              setTimeout(() => { if (this.firmaio && this.firmaio.nativeElement) { console.log('timeout chiusura'); this.firmaio.nativeElement.reset(); } }, 180000);
              //this.toastService.show(response.message, { classname: 'bg-success text-light', delay: 6000 });
            }
          }


        } else {
          this.firmaio.nativeElement.reset();
          const msg = this.getAllertMessage(response.message);

          const badges = `
          <span>Non hai l’app IO? Scaricala ora</span>
          <div style="display:flex;flex-direction:row;align-items:center;padding:10px">
            <a href="https://apps.apple.com/it/app/io/id1501681835" style="display:inline-block;overflow:hidden;border-radius:13px">
              <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/it-it?size=250x83&releaseDate=1586995200" alt="Download on the App Store" style="border-radius:13px;height:40px;width:120px">
            </a>
            <a href="https://play.google.com/store/apps/details?id=it.pagopa.io.app">
              <img alt="Disponibile su Google Play" style="height:50px;width:130px" src="https://play.google.com/intl/en_us/badges/static/images/badges/it_badge_web_generic.png">
            </a>
          </div>`

          this.confirmationDialogService.confirm('Firma con IO', null, null, 'Chiudi', 'lg', msg + badges).then((confirmed) => { }, () => { });
          //this.toastService.show(response.message, { classname: 'bg-danger text-light', delay: 5000 })
          this.messageService.error(response.message);
        }
      },
      (error: any) => {
        console.log('errore chiusura');
        console.log(error);
        this.firmaio.nativeElement.reset();
      });

    // const signatureRequestId = await new Promise((done) => {
    //   setTimeout(() => {
    //     done("SIGNATURE_REQUEST_ID")
    //   }, 1500);
    // });
    // this.firmaio.nativeElement.redirectOrShowQrCode(signatureRequestId);
  };

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();

    if (this.firmaio && this.firmaio.nativeElement) {
      this.firmaio.nativeElement.removeEventListener("io-sign.cta.click", this.eventListener);
    }

  }

  email: SendEmail = null;
  gestioneannulamento: boolean = false;
  gestioneinformazioni: boolean = false;
  story: StoryProcess;
  datiCont: any = null;

  _visualizzaContratto: boolean = false;
  get visualizzatoContratto(): boolean {
    return this._visualizzaContratto || this.sessionStorageService.getItem('visualizzaContratto' + ((this.items) ? this.items.id : ''));
  }

  set visualizzatoContratto(value: boolean) {
    this._visualizzaContratto = value;
    this.sessionStorageService.setItem('visualizzaContratto' + this.items.id, value);
  }

  items: any = null;
  idins: number;

  form = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };

  fields: FormlyFieldConfig[] = [
    // motivazione
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'motivazione',
          type: 'textarea',
          className: 'col-md-12',
          props: {
            required: true,
            label: 'Motivazione',
            rows: 5,
            maxLength: 450,
            description: 'Lunghezza massima 450 caratteri',
          },

          expressionProperties: {
            'props.description': (model, formState) => {
              if (model.tipo_annullamento == 'REVOC') {
                return 'Specificare il numero di decreto della revoca (lunghezza massima 450 caratteri)';
              }
              return 'Lunghezza massima 450 caratteri';
            },

          }
        },
      ],
    }
  ];

  fields2: FormlyFieldConfig[] = [
    // motivazione
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'corpo_testo',
          type: 'textarea',
          className: 'col-md-12',
          props: {
            required: true,
            label: 'Testo della richiesta',
            rows: 5,
          },
        },
      ],
    }
  ];



  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public messageService: MessageService,
    public toastService: ToastService,
    private summaryService: SummaryService,
    private b1ConflittolService: B1ConflittoService,
    protected translateService: TranslateService,
    protected confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal,
    private emailService: EmailListService,
    private tools: InsegnamTools,
    private storyService: StoryProcessService,
    private permissionsService: NgxPermissionsService,
    private sessionStorageService: SessionStorageService,
    private notificaService: NotificaService,
    private goto: RouteMetods,
    private cdr: ChangeDetectorRef,
    private breadcrumbService: BreadcrumbService) {
    super(messageService);

  }


  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    //console.log(IOSignElement);
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
      
        this.summaryService.getSummary(+params.get('id')).subscribe(
          response => {
            this.items = response['datiGenerali'];
            this.breadcrumbService.updateWithId(this.items.id);
            
            this.idins = +params.get('id');

            this.permissionsService.hasPermission(['OP_APPROVAZIONE_AMM', 'OP_APPROVAZIONE_ECONOMICA', 'SUPER-ADMIN']).then(
              (hasPermission) => hasPermission ? this.getIddg(this.items.coper_id) : {}
            );

            this.notificaService.newNotifiche(this.items.notifiche ? this.items.notifiche : [], 'contratto');
          },
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  ngAfterViewInit(): void {
    // console.log(this.firmaio);
    // const cta = document.getElementById("cta") as any;
    // console.log(cta);


    // this.firmaio.changes.subscribe( x=> {
    //   console.log(x);
    //   x.first.nativeElement.addEventListener('io-sign.cta.click', (event: CustomEvent) => {     
    //   setTimeout(() => {
    //     console.log("SIGNATURE_REQUEST_ID");
    //   }, 1500);
    // })});
  }

  getAllertMessage(msg: string) {
    return '<div class="alert alert-danger"><span class="label label-danger me-1">Attenzione</span> ' + msg + '</div>'
  }

  getOrdinativi(compenso: any) {
    return compenso.ordinativi.map(x => x.id_dg).join(', ');
  }

  getIddg(coper_id) {
    this.summaryService.getIddg(+coper_id).subscribe(
      response => {
        this.datiCont = response['datiCont'];
      },
      (error) => this.handleError(error),
      () => this.messageService.info('Lettura effettuata con successo')

    );
  }

  isRevisioneAmministrativa() {
    if (this.items.current_place === 'revisione_amministrativa' || this.items.current_place === 'revisione_amministrativaeconomica') {
      return true;
    }
    return false;
  }

  isRevisioneEconomica() {
    if (this.items.current_place === 'revisione_economica' || this.items.current_place === 'revisione_amministrativaeconomica_economica') {
      return true;
    }
    return false;
  }

  summaryTxt5_amministrativa() {
    if (this.isRevisioneAmministrativa()) {
      return this.translateService.instant('summary_txt5_revisione');
    }
    return this.translateService.instant('summary_txt5');
  }

  summaryTxt5_economica() {
    // 'revisione_economica'
    // 'revisione_amministrativaeconomica_economica'
    if (this.items.current_place === 'revisione_economica') {
      return this.translateService.instant('summary_txt5_revisione');
    }
    if (this.items.current_place === 'revisione_amministrativaeconomica_economica') {
      return this.translateService.instant('summary_txt5_revisione2');
    }
    return this.translateService.instant('summary_txt5');
  }

  previewcontratto() {
    this.isLoading = true;

    let newWindow = window.open();//OPEN WINDOW FIRST ON SUBMIT THEN POPULATE PDF   
    newWindow.document.write('caricamento ...');

    this.summaryService.previewContratto(this.idins).subscribe(file => {
      this.isLoading = false;
      if (file && file.filevalue) {
        this.visualizzatoContratto = true;

        const blob = new Blob([decode(file.filevalue)], { type: 'application/pdf' });

        const fileURL = URL.createObjectURL(blob);
        newWindow.location.href = fileURL;//POPULATING PDF        
      } else {
        newWindow.close();
      }
    },
      e => {
        this.isLoading = false;
        newWindow.close();
        console.log(e);
      }
    );
  }

  downloadContratto(event) {
    if (this.items.flag_submit) {
      const attach = this.items['attachments'].find(x => x.attachmenttype_codice === 'CONTR_BOZZA');
      this.download(attach.id);
    }
  }

  downloadContrattoFirma() {
    if (this.items.flag_submit) {
      const attach = this.items['attachments'].find(x => x.attachmenttype_codice === 'CONTR_FIRMA');
      this.download(attach.id);
    }
  }

  downloadCV() {
    if (this.items.flag_submit) {
      const attach = this.items['userattachments'].find(x => x.attachmenttype_codice === 'DOC_CV');
      if (attach) {
        this.download(attach.id);
      } else {
        this.messageService.error('Allegato non presente');
      }
    }
  }

  download(id) {
    this.summaryService.download(id).subscribe(file => {
      if (file.filevalue) {
        const blob = new Blob([decode(file.filevalue)]);
        saveAs(blob, file.filename);
      }
    },
      e => { console.log(e); }
    );

  }

  downloadModulisticaPrecontr() {
    this.isLoading = true;
    //aperture al di fuori della chiamata asicrona per il blocco popup
    let newWindow = window.open();//OPEN WINDOW FIRST ON SUBMIT THEN POPULATE PDF   
    newWindow.document.write('caricamento ...');

    this.summaryService.modulisticaPrecontr(this.idins).subscribe(file => {
      this.isLoading = false;
      if (file && file.filevalue) {
        const blob = new Blob([decode(file.filevalue)], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(blob);
        newWindow.location.href = fileURL;//POPULATING PDF       
      } else {
        newWindow.close();
      }
    },
      e => {
        this.isLoading = false;
        newWindow.close();
        console.log(e);
      }
    );
  }

  generatePdf(item, kind) {
    // implementare api
    this.b1ConflittolService.generatePdf(item.b1_confl_interessi_id, kind).subscribe(file => {
      if (file.filevalue) {
        const blob = new Blob([decode(file.filevalue)]);
        saveAs(blob, file.filename);
      }
    },
      e => { console.log(e); }
    );
  }

  validazioneAmm() {
    this.confirmationDialogService.confirm('Conferma', 'Procedere con l\'operazione di validazione?')
      .then((confirmed) => {
        if (confirmed) {
          const data: IPrecontrStore<any> = {
            insegn_id: this.idins,
            entity: {
              flag_upd: true
            }
          };

          this.isLoading = true;
          this.summaryService.validazioneAmm(data).subscribe(
            response => {
              this.isLoading = false;
              if (response.success) {
                this.items = { ...this.items, ...response.data };
                this.messageService.info('Operazione di validazione terminata con successo');
                this.storyProcess('Precontrattuale validata da Ufficio Amm.ne e Reclutamento Personale Docente');
              } else {
                this.messageService.error(response.message);
              }
            }
          );
        }
      });
  }

  validazioneEconomica() {
    this.confirmationDialogService.confirm('Conferma', 'Procedere con l\'operazione di validazione?')
      .then((confirmed) => {
        if (confirmed) {
          const data: IPrecontrStore<any> = {
            insegn_id: this.idins,
            entity: {
              flag_amm: true
            }
          };

          this.isLoading = true;
          this.summaryService.validazioneEconomica(data).subscribe(
            response => {
              this.isLoading = false;
              if (response.success) {
                this.items = { ...this.items, ...response.data };
                this.messageService.info('Operazione di validazione terminata con successo');
                if (response.message) {
                  this.messageService.info(response.message, false);
                }
                this.storyProcess('Precontrattuale validata da Ufficio Trattamenti Economici e Previdenziali');
              } else {
                this.messageService.error(response.message);
              }
            }
          );
        }
      });
  }

  annullaAmm() {
    this.confirmationDialogService.inputConfirm('Conferma', 'Procedere con l\'operazione di annullamento?')
      .then((confirmed) => {
        if (confirmed.result) {
          const data: IPrecontrStore<any> = {
            insegn_id: this.idins,
            entity: {
              flag_upd: false,
              note: confirmed.entity
            }
          };

          this.isLoading = true;
          this.summaryService.annullaAmm(data).subscribe(
            response => {
              this.isLoading = false;
              if (response.success) {
                this.items = { ...this.items, ...response.data };
                this.messageService.info('Operazione di annullamento terminata con successo');
              } else {
                this.messageService.error(response.message);
              }
            }
          );
        }
      });
  }

  annullaEconomica() {
    this.confirmationDialogService.inputConfirm('Conferma', 'Procedere con l\'operazione di annullamento?')
      .then((confirmed) => {
        if (confirmed.result) {
          const data: IPrecontrStore<any> = {
            insegn_id: this.idins,
            entity: {
              flag_amm: false,
              note: confirmed.entity
            }
          };

          this.isLoading = true;
          this.summaryService.annullaEconomica(data).subscribe(
            response => {
              this.isLoading = false;
              if (response.success) {
                this.items = { ...this.items, ...response.data };
                this.messageService.info('Operazione di annullamento terminata con successo');
              } else {
                this.messageService.error(response.message);
              }
            }
          );
        }
      });
  }

  presaVisione() {
    const message: string =
      `<p align="justify">Procedendo con questa operazione, si dichiara di aver preso visione 
    del contratto di insegnamento e di averlo accettato in tutte le sue parti.</p>`;

    //caricare la preview del contratto    
    const filevalue$ = this.summaryService.previewContratto(this.idins).pipe(map(file => {
      //console.log(file);
      if (file && file.filevalue) {
        const decoded = decode(file.filevalue);
        return decoded;
      }
      return null;
    },
      e => {
        this.messageService.error('Errore caricamento contratto');
        console.log(e);
      }));

    this.confirmationDialogService.confirm('Accettazione contratto', null, 'Accetta', 'Annulla', 'lg', message, filevalue$)
      .then((confirmed) => {
        if (confirmed) {
          const data: IPrecontrStore<any> = {
            insegn_id: this.idins,
            entity: {
              flag_accept: true,
            }
          };

          this.isLoading = true;
          this.summaryService.presaVisioneAccettazione(data).subscribe(
            response => {
              this.isLoading = false;
              if (response.success) {
                this.items = { ...this.items, ...response.data.validazioni };
                this.items.attachments = response.data.attachments;
                this.sessionStorageService.removeItem('visualizzaContratto' + this.items.id);
                this.messageService.info('Operazione di presa visione e accettazione terminata con successo');
                //this.storyProcess('Presa visione e accettazione del contratto da parte del docente');
              } else {
                this.messageService.error(response.message);
              }
            }
          );
        }
      },
        () => { });

  }

  annullaContratto() {
    const msg = 'Procedere con l\'operazione di ' + (this.model.tipo_annullamento == 'REVOC' ? 'revoca?' : 'rinuncia?');
    this.confirmationDialogService.confirm('Conferma', msg)
      .then((confirmed) => {
        if (confirmed) {
          const data: IPrecontrStore<any> = {
            insegn_id: this.idins,
            entity: this.model
          };

          this.isLoading = true;
          this.summaryService.annullaContratto(data).subscribe(
            response => {
              this.isLoading = false;
              if (response.success) {
                this.items = { ...this.items, ...response.data };
                this.messageService.info('Operazione di ' + (this.model.tipo_annullamento == 'REVOC' ? 'revoca' : 'rinuncia') + ' terminata con successo');
              } else {
                this.messageService.error(response.message);
              }
            }
          );
        }
      });
  }

  annullaAnnullaContratto() {
    const msg = 'Procedere con l\'operazione di Annulla ' + (this.model.tipo_annullamento == 'REVOC' ? 'revoca?' : 'rinuncia?');
    this.confirmationDialogService.confirm('Conferma', msg)
      .then((confirmed) => {
        if (confirmed) {
          const data: IPrecontrStore<any> = {
            insegn_id: this.idins,
            entity: this.model
          };

          this.isLoading = true;
          this.summaryService.annullaAnnullaContratto(data).subscribe(
            response => {
              this.isLoading = false;
              if (response.success) {
                this.items = { ...this.items, ...response.data };
                this.messageService.info('Operazione di ripristino terminata con successo');
              } else {
                this.messageService.error(response.message);
              }
            }
          );
        }
      });
  }

  rinunciaCompenso() {
    this.confirmationDialogService.inputConfirm('Conferma', 'Procedere con l\'operazione di rinuncia?','Si','No','lg',null,[
      // motivazione
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'motivazione',
            type: 'textarea',
            className: 'col-md-12',
            props: {
              required: true,
              label: 'Motivazione',
              rows: 5,
              maxLength: 450,
              description: 'Lunghezza massima 450 caratteri',
            },
  
            expressionProperties: {
              'props.description': (model, formState) => {
                  return 'Specificare il numero dell\'atto a supporto della rinuncia al compenso (lunghezza massima 450 caratteri)';
              },
  
            }
          },
        ]}]
        )
      .then((confirmed) => {
        if (confirmed.result) {
          const data: IPrecontrStore<any> = {
            insegn_id: this.idins,
            entity: {
              ...confirmed.entity,
              flag_no_compenso: true
            }
          };

          this.isLoading = true;
          this.summaryService.rinunciaCompenso(data).subscribe(
            response => {
              this.isLoading = false;
              if (response.success) {
                this.items = { ...this.items, ...response.data };
                this.messageService.info('Operazione di rinuncia al compenso terminata con successo');
              } else {
                this.messageService.error(response.message);
              }
            }
          );
        }
      });
  }

  annullaRinuncia() {
    this.confirmationDialogService.confirm('Conferma', 'Procedere con l\'operazione di annullamento?')
      .then((confirmed) => {
        if (confirmed) {
          const data: IPrecontrStore<any> = {
            insegn_id: this.idins,
            entity: {
              flag_no_compenso: false
            }
          };

          this.isLoading = true;
          this.summaryService.annullaRinuncia(data).subscribe(
            response => {
              this.isLoading = false;
              if (response.success) {
                this.items = { ...this.items, ...response.data };
                this.messageService.info('Operazione di annullamento terminata con successo');
              } else {
                this.messageService.error(response.message);
              }
            }
          );
        }
      });
  }

  isRinuncia() {
    return this.items.flag_no_compenso;
  }

  // stati
  isCompilato() {
    return this.items.flag_submit === 1;
  }

  isValidatoAmm() {
    return this.items.flag_upd === 1 && this.isCompilato();
  }

  isValidatoEconomica() {
    return this.items.flag_amm === 1 && this.isValidatoAmm();
  }

  isAccettato() {
    return this.items.flag_accept === 1 && this.isValidatoEconomica();
  }

  isFirmato() {
    return (this.items.stato === 1 || this.items.stato === 3) && this.isAccettato();
  }

  isAnnullato() {
    return this.items.stato === 2 || this.items.stato === 3;
  }

  // step attivo compilazionie
  isStepCompilazione() {
    return !this.isCompilato();
  }

  // step attivo per eseguire la prima validazione
  isStepValidazioneAmm() {
    return this.items.flag_upd === 0 && this.isCompilato();
  }

  // step attivo per eseguire la seconda validazione
  isStepValidazioneEconomica() {
    return this.items.flag_amm === 0 && this.isValidatoAmm();
  }

  isStepPresaVisione() {
    return this.items.flag_accept === 0 && this.isValidatoEconomica();
  }

  isAnnullabile() {
    return this.items.stato < 1;
  }

  isStepFirma() {
    return this.isStepPresaVisione() && !this.items.firmaUtente;
  }

  isStepFirmaProvider(nomeProvider = null) {
    if (nomeProvider) {
      return this.isStepPresaVisione() && this.items.firmaUtente && this.items.firmaUtente.nomeProvider == nomeProvider;
    }
    return this.isStepPresaVisione() && this.items.firmaUtente != null;
  }

  toggleGestioneannulamento(tipo) {

    //se è gia aperto e il tipo è diverso dal corrente 
    if (this.gestioneannulamento && this.model.tipo_annullamento && this.model.tipo_annullamento != tipo) {
      this.model.tipo_annullamento = tipo;
      this.cdr.detectChanges();
    } else {
      this.model.tipo_annullamento = tipo;
      this.gestioneannulamento = !this.gestioneannulamento;
      this.cdr.detectChanges();
    }
  }

  toggleGestioneInformazioni() {
    this.gestioneinformazioni = !this.gestioneinformazioni;
    this.cdr.detectChanges();
  }

  sendInfoEmail() {
    // tslint:disable-next-line:max-line-length
    this.confirmationDialogService.confirm('Conferma', 'Vuoi procedere con l\'invio della richiesta di modifica o integrazioni della modulistica precontrattuale?')
      .then((confirmed) => {
        if (confirmed) {
          this.isLoading = true;
          const data: IPrecontrStore<any> = {
            insegn_id: this.idins,
            entity: this.model
          };
          this.summaryService.sendInfoEmail(data).subscribe(
            response => {
              if (response.success) {
                this.items['richiesta'] = response.data;
                this.gestioneinformazioni = false;
                this.messageService.info(response.message);
                this.storyProcess('Invio richiesta modifica/integrazioni al docente');
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

  storyProcess(description: string) {
    this.story = new StoryProcess();
    this.story.insegn_id = this.idins;
    this.story.descrizione = description;
    this.storyService.newStory(this.story).subscribe(
      response => {
        if (response['success']) {
          this.messageService.info('Storia del processo aggiornata con successo', false);
        } else {
          this.messageService.error(response['message']);
        }
      }
    );
  }

  apriPaginaEsterna() {
    const attach = this.items['attachments'].find(x => x.attachmenttype_codice === 'CONTR_FIRMA');
    if (attach) {
      let titulus = window.open('', '_blank');
      this.summaryService.getTitulusDocumentURL(attach.id).subscribe(
        (data) => titulus.location.href = data.url,
        (error) => {
          titulus.close();
          console.log(error);
        }
      );
    }
  }

  getUgovIddg(coper_id) {
    // let iddg = null;
    this.summaryService.getIddg(coper_id).subscribe(
      response => {
        return response['datiCont']['id_dg'];
      },
      (error) => this.handleError(error),
      () => this.complete()
    );
  }


  richiestaFirmaUSIGN() {

    const data: IPrecontrStore<any> = {
      insegn_id: this.idins,
      entity: {}
    };

    this.isLoading = true;

    //chiamata per la richiesta di firma con app IO ... 
    this.summaryService.richiestafirmausign(data).subscribe(
      response => {

        this.isLoading = false;

        if (response.success) {
          this.messageService.clear();
          if (response.message) {
            this.messageService.info(response.message);
          }

          if (response.data.validazioni) {
            //se restituisce la tabella validazioni aggiorno la precontrattuale e esco          
            this.items = { ...this.items, ...response.data.validazioni };
            this.items.attachments = response.data.attachments;
            this.sessionStorageService.removeItem('visualizzaContratto' + this.items.id);
            this.messageService.info('Operazione firma contratto terminata con successo');
          } else {
            if (response.data.stato == 'rejected') {
              this.items.firmaUtente = null;
              this.toastService.show(response.message, { classname: 'bg-warning text-light', delay: 5000 })
              this.messageService.info(response.message);
            } else {

              // let message: string =
              // `<div>
              // <p align="justify">Il processo di firma è stato attivato con successo. Per procedere con la firma, utilizzare il seguente pulsante: </p>
              // <a align="text-center" class="btn btn-primary btn-lg active" role="button" target="_blank" href="${response.data.link}">Firma</a>
              //  <p align="justify" class="mt-3"><small>oppure copiare e incollare questo indirizzo in una nuova finestra del broswer ${response.data.link}</small></p>
              // </div>`;

              this.confirmationDialogService.inputConfirm('Firma contratto', null, null, 'Chiudi', 'lg', null, this.fieldFirmaUSign(response.data.link))
                .then((confirmed) => { }, () => { });

              this.items.firmaUtente = response.data;
              //visualizza la form di inserimento dell'OTP
              // process_id == token per U-Sing
              //CASO PROCEDURE DI FIRMA SINCRONA
              //this.showFormUSING(response.data.process_id);
            }
          }

        } else {
          if (response.data && response.data.code) {
            const translationKey = 'errori.' + response.data.code;
            const translatedMsg = this.translateService.instant(translationKey);

            // Use the translated message if it exists, otherwise fallback to response.data.message or a generic message.
            const baseMsg = translatedMsg !== translationKey 
                ? translatedMsg 
                : response.message || translationKey;

            const msg = this.getAllertMessage(baseMsg);
            //const msg = this.getAllertMessage(this.translateService.instant('errori.' + response.data.code));
            this.confirmationDialogService.confirm('Firma con U-Sign', null, null, 'Chiudi', 'lg', msg)
              .then((confirmed) => { }, () => { });

            this.messageService.info(response.message);
          } else {
            this.toastService.show(response.message, { classname: 'bg-danger text-light', delay: 5000 })
            this.messageService.error(response.message);
          }
        }
      },
      (error: any) => {
        this.isLoading = false;
      });

  }

  fieldfirmacontratto = (): FormlyFieldConfig[] => [
    {
      fieldGroup: [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              key: 'firma_dipendente',
              type: 'signnamirial',
              className: 'col-md-12',
              props: {
                tipo_modello: 'contratto',
                ordinefirma: 0,
                required: true,
                translate: true,
                label: 'Firma contratto'
              },
              hooks: {
                onInit: (field) => {
                  //carica il pdf              
                  setTimeout(() => {
                    this.isLoading = true;
                  });

                  this.summaryService.previewContratto(this.idins).subscribe(file => {
                    this.isLoading = false;
                    if (file && file.filevalue) {
                      field.options.formState.pdfSrc = of(decode(file.filevalue));
                    }
                    field.options.formState.widgetPDFSignaturePosition = file.widgetPDFSignaturePosition ? file.widgetPDFSignaturePosition : null;
                  });
                }
              }
            },
          ],
        },

      ],
    }
  ];

  firmaGrafometrica() {
    const message: string =
      `<p align="justify">Premi il bottone di firma e firma sul dispositivo.</p>`;

    this.confirmationDialogService.inputConfirm('Firma Grafometrica', null, 'Accetta', 'Annulla', 'lg', message, this.fieldfirmacontratto(), null, {
      ctr: this.items
    })
      .then((confirmed) => {
        if (confirmed.result) {
          const data: IPrecontrStore<any> = {
            insegn_id: this.idins,
            entity: confirmed.entity
          };
          this.isLoading = true;
          this.summaryService.firmaGrafometrica(data).subscribe(
            response => {
              this.isLoading = false;
              if (response.success) {
                this.items = { ...this.items, ...response.data.validazioni };
                this.items.attachments = response.data.attachments;
                this.messageService.info('Operazione di firma terminata con successo');
              } else {
                this.messageService.error(response.message);
              }
            });
        }
      });
  }

  firmaSmartcard() {
    const message: string =
      `<p align="justify">Posiziona la carta di firma sul lettore.</p>`;

    //caricare la preview del contratto    
    const filevalue$ = this.summaryService.previewContratto(this.idins).pipe(map(file => {
      //console.log(file);
      if (file && file.filevalue) {
        const decoded = decode(file.filevalue);
        return decoded;
      }
      return null;
    },
      e => {
        this.messageService.error('Errore caricamento contratto');
        console.log(e);
      }));

    this.confirmationDialogService.inputConfirm('Firma con SmartCard', null, 'Accetta', 'Annulla', 'lg', message, this.fieldfirmacontratto(), filevalue$, {
      ctr: this.items
    })
      .then((confirmed) => {
        if (confirmed) {
          const data: IPrecontrStore<any> = {
            insegn_id: this.idins,
            entity: {
              flag_accept: true,
            }
          };

          //TODO leggi file firmato e fai l'upload

          // this.isLoading = true;
          // this.summaryService.presaVisioneAccettazione(data).subscribe(
          //   response => {
          //     this.isLoading = false;
          //     if (response.success) {
          //       this.items = { ...this.items, ...response.data.validazioni };
          //       this.items.attachments = response.data.attachments;
          //       this.sessionStorageService.removeItem('visualizzaContratto' + this.items.id);
          //       this.messageService.info('Operazione di presa visione e accettazione terminata con successo');
          //       //this.storyProcess('Presa visione e accettazione del contratto da parte del docente');
          //     } else {
          //       this.messageService.error(response.message);
          //     }
          //   }
          // );
        }
      },
        () => { });

  }


  cancellazioneIstanzaFirmaUtente() {
    const data: IPrecontrStore<any> = {
      insegn_id: this.idins,
      entity: this.items.firmaUtente
    };

    this.isLoading = true;

    //chiamata per la richiesta di cancellazione 
    this.summaryService.cancellazioneIstanzaFirmaUtente(data).subscribe(
      response => {
        this.isLoading = false;
        if (response.success) {
          this.messageService.clear();
          if (response.message) {
            this.items.firmaUtente = null;
            this.messageService.info(response.message);
          }
        } else {
          this.toastService.show(response.message, { classname: 'bg-danger text-light', delay: 5000 })
          this.messageService.error(response.message);
        }
      },
      (error: any) => {
        this.isLoading = false;
      });
  }
  //finestra pop apertura esterna u-sing 
  fieldFirmaUSign = (url): FormlyFieldConfig[] => [
    {
      fieldGroup: [
        {
          template: `<p align="justify">Il processo di firma è stato attivato con successo. Per procedere con la firma, utilizzare il seguente pulsante: </p>`
        },
        {
          type: 'button',
          props: {
            btnType: 'btn btn-primary btn-lg active',
            text: 'Vai alla Firma',
            // icon: 'oi oi-data-transfer-download'
            onClick: ($event, model, field: FormlyFieldConfig) => {
              window.open(url);
              field.options.formState.container.dismiss();
            },
          },
        },
        {
          template: `<p align="justify" class="mt-3"><small>apre la pagina di U-Sign oppure copiare e incollare questo indirizzo in una nuova finestra del broswer ${url}</small></p>`
        }
      ],
    }
  ];

  //U-Sign 
  showFormUSING(token) {
    //'3F217368CE026D965DDF278C3B1D60EC2B9396AD7ACDEA37C5189BF87257D487',
    const payload = {
      token: token,
      auth_token: `Bearer ${this.auth.getToken()}`
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        //"Authorization": `Bearer ${this.auth.getToken()}`
      }
    };

    console.log(SDK.config);

    SDK.requestAndProcessOTP(payload, config, this.firmaSuccess, this.firmaError);


    //test FEA 
    // const otp_payload = {
    //     'process_token': payload.token, //payload.process_token
    //     'auth_token': `Bearer ${this.auth.getToken()}`
    // };

    // const otp_config = {
    //     'otp_form_url': AppConstants.baseURL+'otp/sdk/req_otp_fea.html',
    //     'iframe': this.configValue('iframe'),
    //     'iframeParent': this.configValue('iframeParent'),
    //     'modal_show_func': this.configValue('modal_show_func'),
    // };    

    // SDK.config.CLIENT_OTP_URL = AppConstants.baseApiURL+'/otp/';
    // // on success completion open OTP and PIN page submission
    // console.log("Chiamata: OTP_FEA_Init");
    // SDK.OTP_FEA_Init(otp_payload, otp_config, this.successCallback, this.firmaError);

    //apre una finestra che prima prova a collegarsi a 
    //my-web-firma/api/public/sendToFEA

    // <app-root id="componenteFea" usigntoken="" uploadurl="/my-web-firma/api/public/sendToFEA" downloadurl="/my-web-firma/api/public/signWithFEA" sdk="true">
    // </app-root>



    // if iframe-mode we have to tell to client function to show it inside a modal window
    // if (otp_config.iframe && ( typeof otp_config.modal_show_func != 'undefined' )) {
    //     var modal_show_func = otp_config.modal_show_func;
    //     modal_show_func();
    // }

    //SDK.requestAndProcessOTP(payload, config, this.firmaSuccess, this.firmaError);
  };

  successCallback(resp) {    /* success callback: request OTP and open form to sign */
    var payloadOTP = {
      'process_token': resp.token,
      'successCallback': this.firmaSuccess,
      'errorCallback': this.firmaError

    };
    this.firmaSuccess(resp);
  }/*, 


  /**
  * Retrieves, if present, the value assigned to the requested configuration parameter.
  *  
  * @param {string} configParam - the configuration parameter name to retrieve
  */
  configValue(configParam) {
    return SDK.config[configParam];
  }

  firmaSuccess(response) {
    var stringified = JSON.stringify(response);
    console.log("FIRMA SUCCESS: " + stringified);
  };

  firmaError(response) {
    var stringified = JSON.stringify(response);
    console.log("FIRMA ERROR: " + stringified);
  };

  openUserModal(userId: number) {
    const modalRef = this.modalService.open(DynamicModalComponent, { size: 'xl' });
    modalRef.componentInstance.title = 'Dettaglio Utente';
    modalRef.componentInstance.component = UserComponent;
    modalRef.componentInstance.inputs = { idModal: userId };
  }
  
}
