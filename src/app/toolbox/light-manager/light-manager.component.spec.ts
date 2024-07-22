import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LightManagerComponent } from './light-manager.component';

describe('LightManagerComponent', () => {
  let component: LightManagerComponent;
  let fixture: ComponentFixture<LightManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LightManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LightManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
