import { FormlyTemplateOptions } from '@ngx-formly/core';
import { UserComponent } from '../../user/user.component';
import { Insegnamento, Updp1 } from '../../../classes/insegnamento';
import { InsegnUgov } from '../../../classes/insegn-ugov';
import { InsegnamentoService } from '../../../services/insegnamento.service';
import { Component, OnInit, Output, EventEmitter, NgModule, LOCALE_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { MycurrencyPipe } from './../../../shared/pipe/custom.currencypipe';
import { RouteMetods } from './../../../classes/routeMetods';
import { MessageService, BaseComponent } from './../../../shared';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';
import { InsegnUgovService } from '../../../services/insegn-ugov.service';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';

@Component({
  selector: 'app-insegn-detail',
  templateUrl: './insegn-detail.component.html',
  styleUrls: [
    './insegn-detail.component.css'
  ]
})

@NgModule({
  providers: [{
    provide: LOCALE_ID,
    useValue: 'it-IT' // for Italy,
  }]
})

export class InsegnDetailComponent extends BaseComponent {

  item: Insegnamento;
  itemUgov: InsegnUgov;
  itemUpdP1: Updp1;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private insegnamentoService: InsegnamentoService,
    private ugovService: InsegnUgovService,
    public messageService: MessageService,
    public confirmationDialogService: ConfirmationDialogService,
    private tools: InsegnamTools,
    private goto: RouteMetods) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.insegnamentoService.getInsegnamento(+params.get('id')).subscribe(
          response => {
            if (!response['success']) {
              this.messageService.error(response['message'], true);
            }
            this.item = response['datiInsegnamento']
          },
          (error) => { this.isLoading = false; },
          () => this.isLoading = false
        );
      }
    );
  }

  gotoP2(idins: number, idP2: number) {
    if (idP2 === 0) {
      this.router.navigate(['home/p2rapporto', idins]);
    } else {
      this.router.navigate(['home/p2rapporto/details', idP2]);
    }
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
          if (response['message']){
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


  inserisciManualmente() {
    this.confirmationDialogService.inputConfirm('Inserimento', 'Inserimento manuale del numero dei precedenti insegnamenti', 'Conferma', 'Annulla', 'sm', null, [
      // motivazione
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            key: 'contatore_insegnamenti_manuale',
            type: 'number',
            className: 'col-md-12',
            templateOptions: {
              min: 1,
              required: true,
              label: 'Numero precedenti insegnamenti',
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
          this.insegnamentoService.changeContatoreInsegnamentiManuale(data).subscribe(
            response => {
              this.isLoading = false;
              if (response.success) {                
                this.item.contatore_insegnamenti_manuale = response.data.contatore_insegnamenti_manuale;
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
      entity:  {
        contatore_insegnamenti_manuale: null
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
