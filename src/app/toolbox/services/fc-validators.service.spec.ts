import { TestBed } from '@angular/core/testing';
import { FcValidatorsService } from './fc-validators.service';



describe('FcValidationService', () => {
  let service: FcValidatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FcValidatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
