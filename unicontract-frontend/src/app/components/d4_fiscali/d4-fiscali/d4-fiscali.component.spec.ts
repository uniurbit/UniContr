import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D4FiscaliComponent } from './d4-fiscali.component';

describe('D4FiscaliComponent', () => {
  let component: D4FiscaliComponent;
  let fixture: ComponentFixture<D4FiscaliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D4FiscaliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D4FiscaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
