import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { D2InailComponent } from './d2-inail.component';

describe('D2InailComponent', () => {
  let component: D2InailComponent;
  let fixture: ComponentFixture<D2InailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ D2InailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D2InailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
