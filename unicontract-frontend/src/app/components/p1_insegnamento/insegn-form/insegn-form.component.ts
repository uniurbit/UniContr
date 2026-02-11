import { ActivatedRoute, Router } from '@angular/router';
import { InsegnamentoService } from '../../../services/insegnamento.service';
import { Insegnamento } from '../../../classes/insegnamento';
import { Component, OnInit, Input } from '@angular/core';
import { InsegnamTools } from './../../../classes/insegnamTools';
import { MessageService, BaseComponent } from './../../../shared';

@Component({
    selector: 'app-insegn-form',
    templateUrl: './insegn-form.component.html',
    styleUrls: ['./insegn-form.component.css'],
    standalone: false
})
export class InsegnFormComponent extends BaseComponent {
  private insegnamentoCopy: Insegnamento;
  private __insegnamento: Insegnamento;

  @Input() set insegnamento(insegnamento: Insegnamento) {
    this.__insegnamento = insegnamento;
    this.insegnamentoCopy = Object.assign({}, insegnamento);
  }

  get insegnamento() {
    return this.__insegnamento;
  }

  constructor(private insegnamentoService: InsegnamentoService,
              private route: ActivatedRoute,
              public messageService: MessageService,
              private router: Router,
              public tools: InsegnamTools) { super(messageService); }

  ngOnInit() {
    this.insegnamento = new Insegnamento();
    this.route.paramMap.subscribe(
      (params) => {
        if (!params.get('id')) {
          return;
        }
        this.isLoading = true;
        this.insegnamentoService.getInsegnamento(+params.get('id')).subscribe(
          response => this.insegnamento = response['datiInsegnamento'],
          (error) => this.handleError(error),
          () => this.complete()
        );
      }
    );
  }

}
