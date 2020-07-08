import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B6PrivacyComponent } from './b6-privacy.component';

describe('B6PrivacyComponent', () => {
  let component: B6PrivacyComponent;
  let fixture: ComponentFixture<B6PrivacyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B6PrivacyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B6PrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
