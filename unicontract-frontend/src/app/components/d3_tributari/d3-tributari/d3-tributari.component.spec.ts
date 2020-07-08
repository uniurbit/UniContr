import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3TributariComponent } from './d3-tributari.component';

describe('D3TributariComponent', () => {
  let component: D3TributariComponent;
  let fixture: ComponentFixture<D3TributariComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3TributariComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3TributariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
