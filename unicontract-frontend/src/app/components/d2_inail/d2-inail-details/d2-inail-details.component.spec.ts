import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D2InailDetailsComponent } from './d2-inail-details.component';

describe('D2InailDetailsComponent', () => {
  let component: D2InailDetailsComponent;
  let fixture: ComponentFixture<D2InailDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D2InailDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D2InailDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
