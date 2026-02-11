import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsegnDetailComponent } from './insegn-detail.component';

describe('InsegnDetailComponent', () => {
  let component: InsegnDetailComponent;
  let fixture: ComponentFixture<InsegnDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InsegnDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsegnDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
