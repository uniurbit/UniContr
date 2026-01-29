import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { InsegnUgov } from './../../../classes/insegn-ugov';
import { InsegnUgovService } from './../../../services/insegn-ugov.service';
import { InsegnamTools } from './../../../classes/insegnamTools';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tr[app-insegnamento-ugov]',
    templateUrl: './insegnamento-ugov.component.html',
    styleUrls: ['./insegnamento-ugov.component.css'],
    standalone: false
})
export class InsegnamentoUgovComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('insegn-ugov') ugov: InsegnUgov;

  constructor(private insegnUgovService: InsegnUgovService,
              private route: Router,
              public tools: InsegnamTools) { }

  ngOnInit() {
  }

  showInsegnUgovDetail() {
    this.route.navigate(['home/ugov-insegn-detail', this.ugov.coper_id, this.ugov.aa_off_id]);
  }

}
