import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInsegnamentiUgovComponent } from './lista-insegnamenti-ugov.component';
import { UniqueName } from 'src/app/shared/pipe/unique-name';

describe('ListaInsegnamentiUgovComponent', () => {
  let component: ListaInsegnamentiUgovComponent;
  let fixture: ComponentFixture<ListaInsegnamentiUgovComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaInsegnamentiUgovComponent, UniqueName ]
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
