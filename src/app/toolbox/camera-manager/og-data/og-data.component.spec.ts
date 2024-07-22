import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OgDataComponent } from './og-data.component';

describe('OgDataComponent', () => {
  let component: OgDataComponent;
  let fixture: ComponentFixture<OgDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OgDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OgDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
