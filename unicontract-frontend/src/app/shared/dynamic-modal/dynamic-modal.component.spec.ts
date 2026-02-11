import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicModalComponent } from './dynamic-modal.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  template: '<p>Fake component</p>'
})
class FakeInnerComponent {}

describe('DynamicModalComponent', () => {
  let component: DynamicModalComponent;
  let fixture: ComponentFixture<DynamicModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
          imports: [CommonModule, FakeInnerComponent],
       declarations: [ DynamicModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicModalComponent);
    component = fixture.componentInstance;
    component.component = FakeInnerComponent; // 👈 FONDAMENTALE
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
