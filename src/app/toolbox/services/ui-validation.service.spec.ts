import { TestBed } from '@angular/core/testing';
import { UiValidationService } from './ui-validation.service';



describe('UiValidationService', () => {
  let service: UiValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
