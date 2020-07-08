import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B2IncompatibilitaDetailsComponent } from './b2-incompatibilita-details.component';

describe('B2IncompatibilitaDetailsComponent', () => {
  let component: B2IncompatibilitaDetailsComponent;
  let fixture: ComponentFixture<B2IncompatibilitaDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B2IncompatibilitaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B2IncompatibilitaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
