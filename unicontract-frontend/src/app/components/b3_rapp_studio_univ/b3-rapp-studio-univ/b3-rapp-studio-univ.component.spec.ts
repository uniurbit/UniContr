import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B3RappStudioUnivComponent } from './b3-rapp-studio-univ.component';

describe('B3RappStudioUnivComponent', () => {
  let component: B3RappStudioUnivComponent;
  let fixture: ComponentFixture<B3RappStudioUnivComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B3RappStudioUnivComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B3RappStudioUnivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
