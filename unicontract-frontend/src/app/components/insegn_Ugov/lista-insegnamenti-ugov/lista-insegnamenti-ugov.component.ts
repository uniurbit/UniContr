import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InsegnUgov } from './../../../classes/insegn-ugov';
import { InsegnUgovService } from './../../../services/insegn-ugov.service';
import { UniqueName } from './../../../shared/pipe/unique-name';
import { UniqueYear } from './../../../shared/pipe/unique-year';
import { BaseComponent } from 'src/app/shared/base-component/base.component';
import { MessageService } from 'src/app/shared/message.service';

@Component({
    selector: 'app-lista-insegnamenti-ugov',
    templateUrl: './lista-insegnamenti-ugov.component.html',
    styleUrls: ['./lista-insegnamenti-ugov.component.css'],
    standalone: false
})
export class ListaInsegnamentiUgovComponent extends BaseComponent {

  constructor(private service: InsegnUgovService,
              private router: Router,
              private route: ActivatedRoute,
              messageService: MessageService) {
                super(messageService)
               }

  insegnUgov: InsegnUgov[] = [];
  filteredInsegn: InsegnUgov[] = [];

  private _searchTermTutor: string;

  isLoading = false;

  anno: string;

  selectedOption: string;
  numberOfItems: number;
  errorMessage: string;

  years: Array<Object> = [
    {year: '2022', name: '2022 / 2023'},
    {year: '2021', name: '2021 / 2022'},
    {year: '2020', name: '2020 / 2021'},
    {year: '2019', name: '2019 / 2020'},
    {year: '2018', name: '2018 / 2019'},
    {year: '2017', name: '2017 / 2018'},
    {year: '2016', name: '2016 / 2017'},
  ];

  ngOnInit() {
    this.isLoading = false;
    this.messageService.clear();
    this.route.paramMap.subscribe(
      (param) => {
        const aa_off_id = param.get('aa_off_id');
        if (aa_off_id) {
          this.isLoading = true;
          this.service.getListaInsegnamentiUgov(aa_off_id).subscribe(
            response => this.insegnUgov = response['lista'],
            () => this.filteredInsegn = this.insegnUgov,
            () => this.isLoading = false
          );
        }
      }
    );
  }

  onChange(year) {
    if (year) {
      this.isLoading = true;
      this.service.getListaInsegnamentiUgov(year).subscribe(
        response => {
          this.searchTermTutor = null;
          this.insegnUgov = response['lista'];
        },
        () => this.filteredInsegn = this.insegnUgov,
        () => this.isLoading = false
      );
    }
  }

  get searchTermTutor(): string {
    return this._searchTermTutor;
  }

  set searchTermTutor(value: string) {
    this._searchTermTutor = value;
    this.filteredInsegn = this.filtraInsegnamentiTutor(value);
  }

  filtraInsegnamentiTutor(searchString: string) {
    return this.insegnUgov.filter(item => item.cod_fis === searchString);
  }

  numRecord() {
    // this.numberOfItems = this.filteredInsegn.length;
    if (this.filteredInsegn.length === 1) {
      return 'È presente un insegnamento attribuito';
    } else if (this.filteredInsegn.length === 0) {
      return 'Non è presente alcun insegnamento';
    } else {
      return 'Sono presenti ' + this.filteredInsegn.length + ' insegnamenti attribuiti';
    }
  }

  aa(anno) {
    return +anno + 1;
  }

}
