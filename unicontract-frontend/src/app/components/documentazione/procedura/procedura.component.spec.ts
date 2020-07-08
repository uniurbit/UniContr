import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceduraComponent } from './procedura.component';

describe('ProceduraComponent', () => {
  let component: ProceduraComponent;
  let fixture: ComponentFixture<ProceduraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProceduraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProceduraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
