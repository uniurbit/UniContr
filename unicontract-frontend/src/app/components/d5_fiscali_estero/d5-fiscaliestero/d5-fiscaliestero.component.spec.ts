import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D5FiscaliesteroComponent } from './d5-fiscaliestero.component';

describe('D5FiscaliesteroComponent', () => {
  let component: D5FiscaliesteroComponent;
  let fixture: ComponentFixture<D5FiscaliesteroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D5FiscaliesteroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D5FiscaliesteroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
