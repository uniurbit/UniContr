import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInsegnamentiUgovComponent } from './lista-insegnamenti-ugov.component';

describe('ListaInsegnamentiUgovComponent', () => {
  let component: ListaInsegnamentiUgovComponent;
  let fixture: ComponentFixture<ListaInsegnamentiUgovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaInsegnamentiUgovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaInsegnamentiUgovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
