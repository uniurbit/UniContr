import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D6DetrazionifamiliariDetailsComponent } from './d6-detrazionifamiliari-details.component';

describe('D6DetrazionifamiliariDetailsComponent', () => {
  let component: D6DetrazionifamiliariDetailsComponent;
  let fixture: ComponentFixture<D6DetrazionifamiliariDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D6DetrazionifamiliariDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D6DetrazionifamiliariDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
