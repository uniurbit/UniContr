import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D1InpsComponent } from './d1-inps.component';

describe('D1InpsComponent', () => {
  let component: D1InpsComponent;
  let fixture: ComponentFixture<D1InpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D1InpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D1InpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
