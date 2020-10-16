import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { B4RapportoPA } from './../../../classes/b4rappPA';
import { B4RappPAService } from './../../../services/b4rappPA.service';
import { encode, decode } from 'base64-arraybuffer';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'app-b4-rapp-pa-details',
  templateUrl: './b4-rapp-pa-details.component.html',
  styleUrls: ['./b4-rapp-pa-details.component.css']
})
export class B4RappPaDetailsComponent extends BaseComponent {

  items: B4RapportoPA;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private rapportoPAService: B4RappPAService,              
              private tools: InsegnamTools,
              private goto: RouteMetods) { super(messageService);  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.rapportoPAService.getRappPA(+params.get('id')).subscribe(
          response => this.items = response['datiRapportoPA'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  tempo(value) {
    if (value == 0) {
      return 'parziale';
    } else {
      return 'pieno';
    }
  }

  checkFalse(value: number) {
    if (value === 0) {
      return 'non';
    }
  }

  updateB4(idB4: number) {
    this.router.navigate(['home/rapppa', idB4, {upd: 'upd'}]);
  }

  download(id) {
 
    this.rapportoPAService.download(id).subscribe(file => {
      if (file.filevalue) {
        const blob = new Blob([decode(file.filevalue)]);
        saveAs(blob, file.filename);
      }
    },
      e => { console.log(e); }
    );
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }
}
