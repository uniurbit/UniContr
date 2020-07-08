import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnagraficaLocalDetailsComponent } from './anagrafica-local-details.component';

describe('AnagraficaLocalDetailsComponent', () => {
  let component: AnagraficaLocalDetailsComponent;
  let fixture: ComponentFixture<AnagraficaLocalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnagraficaLocalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnagraficaLocalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
