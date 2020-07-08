import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B1ConflittoComponent } from './b1-conflitto.component';

describe('B1ConflittoComponent', () => {
  let component: B1ConflittoComponent;
  let fixture: ComponentFixture<B1ConflittoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B1ConflittoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B1ConflittoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
