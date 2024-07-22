import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeshManagerComponent } from './mesh-manager.component';

describe('MeshManagerComponent', () => {
  let component: MeshManagerComponent;
  let fixture: ComponentFixture<MeshManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeshManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeshManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
