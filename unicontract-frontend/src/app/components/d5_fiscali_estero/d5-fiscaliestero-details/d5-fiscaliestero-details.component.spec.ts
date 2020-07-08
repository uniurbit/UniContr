import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D5FiscaliesteroDetailsComponent } from './d5-fiscaliestero-details.component';

describe('D5FiscaliesteroDetailsComponent', () => {
  let component: D5FiscaliesteroDetailsComponent;
  let fixture: ComponentFixture<D5FiscaliesteroDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D5FiscaliesteroDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D5FiscaliesteroDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
