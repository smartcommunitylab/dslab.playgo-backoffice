import { TestBed } from '@angular/core/testing';

import { ManagerHandlerService } from './manager-handler.service';

describe('ManagerHandlerService', () => {
  let service: ManagerHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
