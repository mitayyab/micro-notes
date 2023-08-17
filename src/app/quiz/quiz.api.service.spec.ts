import { TestBed } from '@angular/core/testing';

import { QuizzesService } from './quiz.api.service';

describe('QuizzesService', () => {
  let service: QuizzesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizzesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
