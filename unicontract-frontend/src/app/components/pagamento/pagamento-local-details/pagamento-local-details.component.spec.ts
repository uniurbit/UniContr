import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoLocalDetailsComponent } from './pagamento-local-details.component';

describe('PagamentoLocalDetailsComponent', () => {
  let component: PagamentoLocalDetailsComponent;
  let fixture: ComponentFixture<PagamentoLocalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagamentoLocalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagamentoLocalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
