import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UpdSubmit } from 'src/app/classes/validazioni';
import { PrecontrattualeService } from 'src/app/services/precontrattuale.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'src/app/shared';
import { ConfirmationDialogService } from 'src/app/shared/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-termina-button',
  template: `
  <button type="button" class="btn btn-outline-secondary btn-warning rounded me-1 ms-2" (click)="termina(item.insegn_id)" title="{{ 'btn_end_title' | translate }}" >{{ 'btn_end' | translate }}</button>
  `,
  styleUrls: [],
  styles: []
})


// ng g c components/barra-comandi/terminaButton -s true --spec false -t true
export class TerminaButtonComponent implements OnInit {

  @Input() item: any = null;

  @Output('update') isLoadingchange: EventEmitter<any> = new EventEmitter();

  constructor(private route: ActivatedRoute,
    private router: Router, public precontrattualeService: PrecontrattualeService,
    private messageService: MessageService,
    public confirmationDialogService: ConfirmationDialogService) { }

  ngOnInit() {
  }

  termina(idins: number) {
    let message: string =
      `<p align="justify">${this.item.sesso === 'M' ? 'Gent.mo' : 'Gent.ma' } <strong>${this.item.nome} ${this.item.cognome}</strong>,<br>
         la procedura di compilazione della modulistica precontrattuale è terminata. <br>
      Premendo sul tasto TERMINA E INOLTRA, la modulistica sarà inoltrata agli uffici competenti per l'opportuna verifica.<br>
      Successivamente, riceverà una email di riscontro sull'esito della sua compilazione.<br>
      <br>
      Grazie per il suo contributo! </p>`;

    this.confirmationDialogService.confirm('Conferma termina e inoltra', null, 'Termina e inoltra', 'Annulla', 'lg', message)
    .then((confirmed) => {
          if (confirmed) {
            this.isLoadingchange.emit(true);
            const validation = new UpdSubmit();
            validation.insegn_id = idins;
            this.updateValidazione(validation);
        }
      }
    );
  }

  updateValidazione(validaz: any) {
    this.precontrattualeService.terminaInoltra(validaz).subscribe(
      response => {
        this.isLoadingchange.emit(false);
        if (response['success']) {
          this.messageService.info('Procedura di termina e inoltra completata con successo');
          this.router.navigate(['home/summary', this.item.insegn_id]);
        } else {
          this.messageService.error(response['message']);
        }
      },
      error => {
        this.messageService.error(error);
        this.isLoadingchange.emit(false);
      }
    );
  }
}
