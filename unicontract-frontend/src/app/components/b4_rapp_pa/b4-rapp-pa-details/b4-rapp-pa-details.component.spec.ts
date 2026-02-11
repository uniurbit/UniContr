import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { B4RappPaDetailsComponent } from './b4-rapp-pa-details.component';

describe('B4RappPaDetailsComponent', () => {
  let component: B4RappPaDetailsComponent;
  let fixture: ComponentFixture<B4RappPaDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ B4RappPaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B4RappPaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
