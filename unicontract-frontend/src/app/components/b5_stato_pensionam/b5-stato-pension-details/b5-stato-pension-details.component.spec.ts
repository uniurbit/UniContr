import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B5StatoPensionDetailsComponent } from './b5-stato-pension-details.component';

describe('B5StatoPensionDetailsComponent', () => {
  let component: B5StatoPensionDetailsComponent;
  let fixture: ComponentFixture<B5StatoPensionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B5StatoPensionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B5StatoPensionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
