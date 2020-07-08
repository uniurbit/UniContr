import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B3RappStudioUnivDetailsComponent } from './b3-rapp-studio-univ-details.component';

describe('B3RappStudioUnivDetailsComponent', () => {
  let component: B3RappStudioUnivDetailsComponent;
  let fixture: ComponentFixture<B3RappStudioUnivDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B3RappStudioUnivDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B3RappStudioUnivDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
