import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { B5StatoPensionComponent } from './b5-stato-pension.component';

describe('B5StatoPensionComponent', () => {
  let component: B5StatoPensionComponent;
  let fixture: ComponentFixture<B5StatoPensionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ B5StatoPensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B5StatoPensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
