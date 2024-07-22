import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationPropertyComponent } from './animation-property.component';

describe('AnimationPropertyComponent', () => {
  let component: AnimationPropertyComponent;
  let fixture: ComponentFixture<AnimationPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimationPropertyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimationPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
