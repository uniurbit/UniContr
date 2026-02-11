import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { P2DetailsComponent } from './p2-details.component';

describe('P2DetailsComponent', () => {
  let component: P2DetailsComponent;
  let fixture: ComponentFixture<P2DetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ P2DetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(P2DetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
