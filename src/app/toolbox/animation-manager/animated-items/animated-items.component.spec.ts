import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedItemsComponent } from './animated-items.component';

describe('AnimatedItemsComponent', () => {
  let component: AnimatedItemsComponent;
  let fixture: ComponentFixture<AnimatedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimatedItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AnimatedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
