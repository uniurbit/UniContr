import { Insegnamento } from '../../../classes/insegnamento';
import { Router } from '@angular/router';
import { InsegnamentoService } from '../../../services/insegnamento.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tr[app-insegnamento]',
  templateUrl: './insegnamento.component.html',
  styleUrls: ['./insegnamento.component.css']
})
export class InsegnamentoComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('insegn-data') insegn: Insegnamento;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onSelectedInsegn = new EventEmitter;

  constructor(private insegnamentoService: InsegnamentoService, private route: Router) { }

  ngOnInit() {
  }

  showInsegnDetail() {
    this.route.navigate(['home/detail-insegn', this.insegn.id]);
  }

  updateInsegn() {
    this.route.navigate(['home/edit-insegn', this.insegn.id, 'edit']);
    this.onSelectedInsegn.emit(this.insegn);
  }

  formatoPeriodo(value) {
    value = value.replace('GEN', 'JAN');
    value = value.replace('MAG', 'MAY');
    value = value.replace('GIU', 'JUN');
    value = value.replace('LUG', 'JUL');
    value = value.replace('AGO', 'AUG');
    value = value.replace('SET', 'SEP');
    value = value.replace('OTT', 'OCT');
    value = value.replace('DIC', 'DEC');
    return value;
  }
}
