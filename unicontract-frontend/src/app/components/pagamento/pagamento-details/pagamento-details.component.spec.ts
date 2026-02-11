import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoDetailsComponent } from './pagamento-details.component';

describe('PagamentoDetailsComponent', () => {
  let component: PagamentoDetailsComponent;
  let fixture: ComponentFixture<PagamentoDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PagamentoDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagamentoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
