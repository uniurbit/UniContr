import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, BaseComponent } from './../../../shared';
import { RouteMetods } from './../../../classes/routeMetods';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { D3Tributari } from './../../../classes/d3tributari';
import { D3TributariService } from './../../../services/d3tributari.service';
import { DatePipe } from '@angular/common';
import { PrecontrattualeService } from 'src/app/services/precontrattuale.service';
import { encode, decode } from 'base64-arraybuffer';

@Component({
    selector: 'app-d3-tributari-details',
    templateUrl: './d3-tributari-details.component.html',
    styleUrls: ['./d3-tributari-details.component.css'],
    providers: [DatePipe],
    standalone: false
})

export class D3TributariDetailsComponent extends BaseComponent {

  items: D3Tributari = null;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public messageService: MessageService,
              private d3Service: D3TributariService,
              private precontrattualeService: PrecontrattualeService,
              private datePipe: DatePipe,
              private tools: InsegnamTools,
              private goto: RouteMetods) { super(messageService); }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.route.paramMap.subscribe(
      (params) => {
        this.isLoading = true;
        this.d3Service.getDatiTributari(+params.get('id')).subscribe(
          response => this.items = response['datiTributari'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

  updateD3(idD3: number) {
    this.router.navigate(['home/tributari', idD3, {upd: 'on'}]);
  }

  isLoadingChange(event) {
    this.isLoading = event;
  }
  
}
