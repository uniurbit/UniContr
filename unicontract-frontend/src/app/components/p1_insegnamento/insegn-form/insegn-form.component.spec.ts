import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsegnFormComponent } from './insegn-form.component';

describe('InsegnFormComponent', () => {
  let component: InsegnFormComponent;
  let fixture: ComponentFixture<InsegnFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsegnFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsegnFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
