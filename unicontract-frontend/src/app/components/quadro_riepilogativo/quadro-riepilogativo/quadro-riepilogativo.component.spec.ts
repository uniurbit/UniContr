import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuadroRiepilogativoComponent } from './quadro-riepilogativo.component';

describe('QuadroRiepilogativoComponent', () => {
  let component: QuadroRiepilogativoComponent;
  let fixture: ComponentFixture<QuadroRiepilogativoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuadroRiepilogativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuadroRiepilogativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
