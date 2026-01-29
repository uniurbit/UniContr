import { Router } from '@angular/router';
import { Insegnamento } from '../../../classes/insegnamento';
import { InsegnamentoService } from '../../../services/insegnamento.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-lista-insegn',
    templateUrl: './lista-insegn.component.html',
    styleUrls: ['./lista-insegn.component.css'],
    standalone: false
})

export class ListaInsegnComponent implements OnInit {

  insegnamenti: Insegnamento[] = [];
  page = 1;
  pageSize = 7;
  totalItems: number;

  @Output() updateInsegn = new EventEmitter<Insegnamento>();

  constructor(private service: InsegnamentoService, private route: Router) {
  }

  ngOnInit() {    
    this.service.getListaInsegnamenti().subscribe(
      response => {
        this.insegnamenti = response['lista'];
        this.totalItems = this.insegnamenti.length;
      }
    );
  }

  onSelectedInsegn(insegn: Insegnamento) {
    const insegnCopy = Object.assign({}, insegn);
    this.updateInsegn.emit(insegnCopy);
  }

}
