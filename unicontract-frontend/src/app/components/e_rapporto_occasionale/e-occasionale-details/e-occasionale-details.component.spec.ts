import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EOccasionaleDetailsComponent } from './e-occasionale-details.component';

describe('EOccasionaleDetailsComponent', () => {
  let component: EOccasionaleDetailsComponent;
  let fixture: ComponentFixture<EOccasionaleDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EOccasionaleDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EOccasionaleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
