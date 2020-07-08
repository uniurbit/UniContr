import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkEsterniComponent } from './link-esterni.component';

describe('LinkEsterniComponent', () => {
  let component: LinkEsterniComponent;
  let fixture: ComponentFixture<LinkEsterniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkEsterniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkEsterniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
