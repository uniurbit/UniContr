import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { B4RappPaComponent } from './b4-rapp-pa.component';

describe('B4RappPaComponent', () => {
  let component: B4RappPaComponent;
  let fixture: ComponentFixture<B4RappPaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ B4RappPaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(B4RappPaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
