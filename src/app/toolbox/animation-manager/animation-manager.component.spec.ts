import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationManagerComponent } from './animation-manager.component';

describe('AnimationManagerComponent', () => {
  let component: AnimationManagerComponent;
  let fixture: ComponentFixture<AnimationManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimationManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
