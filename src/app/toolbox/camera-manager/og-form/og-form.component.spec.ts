import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OgFormComponent } from './og-form.component';

describe('OgFormComponent', () => {
  let component: OgFormComponent;
  let fixture: ComponentFixture<OgFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OgFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OgFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
