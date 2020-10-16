
import { NgForm } from '@angular/forms';
import { Component, OnInit, NgModule, LOCALE_ID, Input } from '@angular/core';
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

@Component({
  selector: 'app-insegn-ugov-detail',
  templateUrl: './insegn-ugov-detail.component.html',
  styleUrls: [
    './insegn-ugov-detail.component.css'
  ]
})

@NgModule({
  providers: [{
    provide: LOCALE_ID,
    useValue: 'it-IT' // for Italy,
  }]
})

export class InsegnUgovDetailComponent extends BaseComponent {

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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private insegnUgovService: InsegnUgovService,
              private insegnamentoService: InsegnamentoService,
              private precontrattualeService: PrecontrattualeService,
              private docenteService: DocenteService,
              private ruoloDocenteService: RuoloDocenteService,            
              messageService: MessageService,
              private tools: InsegnamTools) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.messageService.clear();
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.insegnUgovService.getInsegnamentoUgov(+params.get('coper_id'), params.get('aa_off_id')).subscribe(
          response => this.item = response['datiUgov'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
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

      this.newPrecontrImportInsegnamento(pre);
    } else {
      this.messageService.error('Spiacente, nessun parametro passato');
    }
  }

  newPrecontrImportInsegnamento(pre: IPrecontrattuale) {
    this.isLoading= true;
    this.precontrattualeService.newPrecontrImportInsegnamento(pre).subscribe(
      response => {
        this.isLoading= false;
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
