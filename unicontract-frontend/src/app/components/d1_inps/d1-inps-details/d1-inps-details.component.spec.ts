import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D1InpsDetailsComponent } from './d1-inps-details.component';

describe('D1InpsDetailsComponent', () => {
  let component: D1InpsDetailsComponent;
  let fixture: ComponentFixture<D1InpsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D1InpsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D1InpsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
