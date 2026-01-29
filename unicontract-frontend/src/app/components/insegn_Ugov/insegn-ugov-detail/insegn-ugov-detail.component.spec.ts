import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsegnUgovDetailComponent } from './insegn-ugov-detail.component';

describe('InsegnUgovDetailComponent', () => {
  let component: InsegnUgovDetailComponent;
  let fixture: ComponentFixture<InsegnUgovDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsegnUgovDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsegnUgovDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
