import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsegnamentoUgovComponent } from './insegnamento-ugov.component';

describe('InsegnamentoUgovComponent', () => {
  let component: InsegnamentoUgovComponent;
  let fixture: ComponentFixture<InsegnamentoUgovComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsegnamentoUgovComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsegnamentoUgovComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
