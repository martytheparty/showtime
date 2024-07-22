import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerspectiveDataComponent } from './perspective-data.component';

describe('PerspectiveDataComponent', () => {
  let component: PerspectiveDataComponent;
  let fixture: ComponentFixture<PerspectiveDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerspectiveDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerspectiveDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
