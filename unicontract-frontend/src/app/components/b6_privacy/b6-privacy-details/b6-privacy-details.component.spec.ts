import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B6PrivacyDetailsComponent } from './b6-privacy-details.component';

describe('B6PrivacyDetailsComponent', () => {
  let component: B6PrivacyDetailsComponent;
  let fixture: ComponentFixture<B6PrivacyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B6PrivacyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B6PrivacyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
