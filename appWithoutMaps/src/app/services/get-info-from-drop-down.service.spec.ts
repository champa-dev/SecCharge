import { TestBed } from '@angular/core/testing';

import { GetInfoFromDropDownService } from './get-info-from-drop-down.service';

describe('GetInfoFromDropDownService', () => {
  let service: GetInfoFromDropDownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetInfoFromDropDownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
