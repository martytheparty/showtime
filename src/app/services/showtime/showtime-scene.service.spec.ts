import { TestBed } from '@angular/core/testing';

import { ShowtimeSceneService } from './showtime-scene.service';

describe('ShowtimeSceneService', () => {
  let service: ShowtimeSceneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowtimeSceneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
