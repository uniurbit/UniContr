import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B1ConflittoDetailsComponent } from './b1-conflitto-details.component';

describe('B1ConflittoDetailsComponent', () => {
  let component: B1ConflittoDetailsComponent;
  let fixture: ComponentFixture<B1ConflittoDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B1ConflittoDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B1ConflittoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
