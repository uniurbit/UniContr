import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryProcessComponent } from './story-process.component';

describe('StoryProcessComponent', () => {
  let component: StoryProcessComponent;
  let fixture: ComponentFixture<StoryProcessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
