import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from './../../../shared/base-component/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from './../../../shared';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { PrecontrattualeService } from './../../../services/precontrattuale.service';

import { Updb6 } from './../../../classes/precontrattuale';
import { B6Informativa } from './../../../classes/b6informativa';
import { B6InformativaService } from './../../../services/b6informativa.service';

import { UntypedFormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { IPrecontrStore } from 'src/app/interface/precontrattuale';
import { B6InformativaInterface } from 'src/app/interface/b6informativa.interface';

@Component({
  selector: 'app-b6-privacy',
  templateUrl: './b6-privacy.component.html',
  styleUrls: ['./b6-privacy.component.css']
})
export class B6PrivacyComponent extends BaseComponent {

  items: any;
  private precontr: Updb6;
  idins: number;
 

  formAttch = new UntypedFormGroup({});
  model: any = {};
  options: FormlyFormOptions = {
    formState: {
      model: this.model,
      isLoading: this.isLoading,
    },
  };

  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'flag1',
          type: 'checkbox',
          className: 'col-auto',
          defaultValue: false,
          templateOptions: {
            translate: true,
            label: 'b6_txt1'
          }
        },
      ]
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'flag2',
          type: 'checkbox',
          className: 'col-auto',
          defaultValue: false,
          templateOptions: {
            translate: true,
            label: 'b6_txt2'
          }
        },
      ]
    },
  ];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private informativaService: B6InformativaService,
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
          this.informativaService.getPrecontr(+params.get('id')).subscribe(
            response => {
              this.items = response['datiPrecontrattuale'];
              this.idins = +params.get('id');
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        } else {
          this.isLoading = true;
          this.informativaService.getPrivacy(+params.get('id')).subscribe(
            response => {
              this.model = response['datiInformativa'];
              this.items = this.model;
            },
            (error) => this.handleError(error),
            () => this.complete()
          );
        }
      }
    );
  }

  saveData(idB6: number) {
    // console.log(this.formAttch.value);
    // console.log(this.model);
    this.isLoading = true;
    if (idB6 === 0) {

      const preStore: IPrecontrStore<B6InformativaInterface> = {
        insegn_id: this.idins,
        entity: this.model,
      }

      this.newInformativa(preStore);
    } else {
      this.updateB6(this.model, idB6);
    }
  }

  newInformativa(privacy) {
    // console.log(pensionam);
    this.precontrattualeService.newPrivacy(privacy).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello B.6: Trattamento dati e informativa sulla privacy creato con successo');
          // AGGIORNA LO SCHEMA PRECONTRATTUALE PASSANDO L'ID DELL'INSEGNAMENTO
          this.precontr = response['data'];          
          this.router.navigate(['home/privacy/details', this.precontr.b6_trattamento_dati_id]);
        } else {
          this.messageService.error(response['message']);
        }        
      }
    );
  }

  updateB6(privacy: B6Informativa, idB6: number) {
    this.informativaService.updatePrivacy(privacy, idB6).subscribe(
      response => {
        this.isLoading = false;
        if (response['success']) {
          this.messageService.info('Modello B.6: Trattamento dati e informativa sulla privacy aggiornato con successo');
        } else {
          this.messageService.error(response['message']);
        }        
        this.router.navigate(['home/privacy/details', idB6]);
      }
    );
  }

}
