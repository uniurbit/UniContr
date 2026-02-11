import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { D4FiscaliDetailsComponent } from './d4-fiscali-details.component';

describe('D4FiscaliDetailsComponent', () => {
  let component: D4FiscaliDetailsComponent;
  let fixture: ComponentFixture<D4FiscaliDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ D4FiscaliDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D4FiscaliDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
