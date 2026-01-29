import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInsegnComponent } from './lista-insegn.component';

describe('ListaInsegnComponent', () => {
  let component: ListaInsegnComponent;
  let fixture: ComponentFixture<ListaInsegnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaInsegnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaInsegnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
