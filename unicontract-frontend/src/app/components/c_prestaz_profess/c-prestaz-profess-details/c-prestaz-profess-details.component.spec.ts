import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CPrestazProfessDetailsComponent } from './c-prestaz-profess-details.component';

describe('CPrestazProfessDetailsComponent', () => {
  let component: CPrestazProfessDetailsComponent;
  let fixture: ComponentFixture<CPrestazProfessDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CPrestazProfessDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CPrestazProfessDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
