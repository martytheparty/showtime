import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerspectiveFormComponent } from './perspective-form.component';

describe('PerspectiveFormComponent', () => {
  let component: PerspectiveFormComponent;
  let fixture: ComponentFixture<PerspectiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerspectiveFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerspectiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
