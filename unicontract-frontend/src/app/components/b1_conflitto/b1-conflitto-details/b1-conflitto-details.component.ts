import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { B1Conflitto } from './../../../classes/b1conflitto';
import { B1ConflittoService } from './../../../services/b1conflitto.service';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { encode, decode } from 'base64-arraybuffer';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-b1-conflitto-details',
  templateUrl: './b1-conflitto-details.component.html',
  styleUrls: ['./b1-conflitto-details.component.css']
})
export class B1ConflittoDetailsComponent extends BaseComponent {

  items: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private b1ConflittolService: B1ConflittoService,
              public messageService: MessageService,
              public tools: InsegnamTools,              
              public goto: RouteMetods) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {    
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.b1ConflittolService.getConflitto(+params.get('id')).subscribe(
          response => this.items = response['datiConflitto'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateB1(id: number) {
    this.router.navigate(['home/conflitto', id, {upd: 'on'}]);
  }

  gotoB2(id: number, idb2: number) {
    if (idb2 === 0) {
      this.router.navigate(['home/incompat', id]);
    } else {
      this.router.navigate(['home/incompat/details', idb2]);
    }
  }

  checkFalse(value: number) {
    if (value === 0) {
      return 'non';
    }
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

  isLoadingChange(event) {
    this.isLoading = event;
  }

}
