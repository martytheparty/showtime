import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontListComponent } from './font-list.component';

describe('FontListComponent', () => {
  let component: FontListComponent;
  let fixture: ComponentFixture<FontListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FontListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FontListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
