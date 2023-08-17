import { TestBed } from '@angular/core/testing';

import { UserInfomrationService } from './user-infomration.service';

describe('UserInfomrationService', () => {
  let service: UserInfomrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInfomrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
