import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInsegnComponent } from './lista-insegn.component';
import { UniqueName } from 'src/app/shared/pipe/unique-name';

describe('ListaInsegnComponent', () => {
  let component: ListaInsegnComponent;
  let fixture: ComponentFixture<ListaInsegnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaInsegnComponent, UniqueName ]
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
