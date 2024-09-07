import { TestBed } from '@angular/core/testing';

import { RecyclableSequenceService } from './recyclable-sequence-service.service';

describe('RecyclableSequenceServiceService', () => {
  let service: RecyclableSequenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecyclableSequenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
