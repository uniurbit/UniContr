import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsegnamentoComponent } from './insegnamento.component';
import { ToDateObjPipe } from 'src/app/shared/pipe/todateobj.pipe';

describe('InsegnamentoComponent', () => {
  let component: InsegnamentoComponent;
  let fixture: ComponentFixture<InsegnamentoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({  
      declarations: [ InsegnamentoComponent, ToDateObjPipe  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsegnamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
