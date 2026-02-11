import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SommarioComponent } from './sommario.component';

describe('SommarioComponent', () => {
  let component: SommarioComponent;
  let fixture: ComponentFixture<SommarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SommarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SommarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
