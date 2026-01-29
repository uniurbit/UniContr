import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsegnamentoComponent } from './insegnamento.component';

describe('InsegnamentoComponent', () => {
  let component: InsegnamentoComponent;
  let fixture: ComponentFixture<InsegnamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsegnamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsegnamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
