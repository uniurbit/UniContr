import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2IncompatibilitaComponent } from './b2-incompatibilita.component';

describe('B2IncompatibilitaComponent', () => {
  let component: B2IncompatibilitaComponent;
  let fixture: ComponentFixture<B2IncompatibilitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2IncompatibilitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2IncompatibilitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
