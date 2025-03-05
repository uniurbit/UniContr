import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { D1Inps } from './../../../classes/d1inps';
import { D1InpsService } from './../../../services/d1inps.service';
import { DatePipe } from '@angular/common';
import { PrecontrattualeService } from 'src/app/services/precontrattuale.service';
import { encode, decode } from 'base64-arraybuffer';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-d1-inps-details',
  templateUrl: './d1-inps-details.component.html',
  styleUrls: ['./d1-inps-details.component.css'],
  providers: [DatePipe]
})

export class D1InpsDetailsComponent extends BaseComponent {

  items: D1Inps = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private inpsService: D1InpsService,
              private precontrattualeService: PrecontrattualeService,
              private datePipe: DatePipe,
              private tools: InsegnamTools,
              private goto: RouteMetods) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.inpsService.getInps(+params.get('id')).subscribe(
          response => this.items = response['datiInps'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateD1(idD1: number) {
    this.router.navigate(['home/inps', idD1, {upd: 'on'}]);
  }

  download(id: number) {
    // implementare api
    this.inpsService.download(id).subscribe(file => {
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
