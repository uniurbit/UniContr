import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { P2PosizioneInsComponent } from './p2-posizione-ins.component';

describe('P2PosizioneInsComponent', () => {
  let component: P2PosizioneInsComponent;
  let fixture: ComponentFixture<P2PosizioneInsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ P2PosizioneInsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(P2PosizioneInsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
