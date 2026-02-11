import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentoLocalUpdateComponent } from './pagamento-local-update.component';

describe('PagamentoLocalUpdateComponent', () => {
  let component: PagamentoLocalUpdateComponent;
  let fixture: ComponentFixture<PagamentoLocalUpdateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PagamentoLocalUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagamentoLocalUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
