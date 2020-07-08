import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';
import { Updb2 } from './../../../classes/precontrattuale';
import { B2IncompatibilitaService } from './../../../services/b2incompatibilita.service';
import { B2Incompatibilita } from './../../../classes/b2incompatibilita';
import { IPrecontrStore } from './../../../interface/precontrattuale';
import { B2IncompatibilitaInterface } from './../../../interface/b2incompatibilita.interface';


@Component({
  selector: 'app-b2-incompatibilita',
  templateUrl: './b2-incompatibilita.component.html',
  styleUrls: ['./b2-incompatibilita.component.css']
})

export class B2IncompatibilitaComponent extends BaseComponent {

  items: B2Incompatibilita;
  private precontr: Updb2;
  idins: number;


  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private incompatService: B2IncompatibilitaService,
              private precontrattualeService: PrecontrattualeService,              
              private tools: InsegnamTools) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        if (!params.get('upd')) {          
          this.update = false;
          this.isLoading = true;
          this.incompatService.getPrecontr(+params.get('id')).subscribe(
            response => {
              this.items = new B2Incompatibilita();
              this.items = response['datiPrecontrattuale'];
              // this.items.flag_incompatibilita = true;
              this.idins = +params.get('id');
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        } else {
          this.isLoading = true;
          this.incompatService.getIncompat(+params.get('id')).subscribe(
            response => {
              this.items = response['datiIncompatib'];
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  saveData(data: any, idB2: number) {
    this.isLoading = true;
    if (idB2 === 0) {
      const preStore: IPrecontrStore<B2IncompatibilitaInterface> = {
        insegn_id: this.idins,
        entity: data,
      };
      this.newIncompat(preStore);
    } else {
      this.updateB2(data, idB2);
    }
  }

  newIncompat(incompat: IPrecontrStore<B2IncompatibilitaInterface>) {
    this.precontrattualeService.newIncompat(incompat).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello B.2: Dichiarazione di incompatibilità creato con successo');
          this.precontr = response['data'];        
          this.router.navigate(['home/incompat/details', this.precontr.b2_incompatibilita_id]);
        } else {
          this.messageService.error(response['message']);
        }        
      }
    );
  }

  updateB2(incompat: B2Incompatibilita, idB2: number) {
    this.incompatService.updateIncompat(incompat, idB2).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello B.2: Dichiarazione di incompatibilità aggiornato con successo');
        } else {
          this.messageService.error(response['message']);
        }        
        this.router.navigate(['home/incompat/details', idB2]);
      }
    );
  }

}
