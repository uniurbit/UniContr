import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { D6DetrazionifamiliariComponent } from './d6-detrazionifamiliari.component';

describe('D6DetrazionifamiliariComponent', () => {
  let component: D6DetrazionifamiliariComponent;
  let fixture: ComponentFixture<D6DetrazionifamiliariComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ D6DetrazionifamiliariComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D6DetrazionifamiliariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
