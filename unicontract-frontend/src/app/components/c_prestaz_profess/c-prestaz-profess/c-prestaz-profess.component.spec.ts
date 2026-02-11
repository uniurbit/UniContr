import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { CPrestazProfessComponent } from './c-prestaz-profess.component';

describe('CPrestazProfessComponent', () => {
  let component: CPrestazProfessComponent;
  let fixture: ComponentFixture<CPrestazProfessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CPrestazProfessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CPrestazProfessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
