import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnagraficaDetailsComponent } from './anagrafica-details.component';

describe('AnagraficaDetailsComponent', () => {
  let component: AnagraficaDetailsComponent;
  let fixture: ComponentFixture<AnagraficaDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnagraficaDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnagraficaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
