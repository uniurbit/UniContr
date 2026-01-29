import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EOccasionaleComponent } from './e-occasionale.component';

describe('EOccasionaleComponent', () => {
  let component: EOccasionaleComponent;
  let fixture: ComponentFixture<EOccasionaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EOccasionaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EOccasionaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
