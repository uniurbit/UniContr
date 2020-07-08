import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDipartimentiComponent } from './dashboard-dipartimenti.component';

describe('DashboardDipartimentiComponent', () => {
  let component: DashboardDipartimentiComponent;
  let fixture: ComponentFixture<DashboardDipartimentiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardDipartimentiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardDipartimentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
