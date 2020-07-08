import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3TributariDetailsComponent } from './d3-tributari-details.component';

describe('D3TributariDetailsComponent', () => {
  let component: D3TributariDetailsComponent;
  let fixture: ComponentFixture<D3TributariDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3TributariDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3TributariDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
