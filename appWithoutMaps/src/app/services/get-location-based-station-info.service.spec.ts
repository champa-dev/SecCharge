import { TestBed } from '@angular/core/testing';

import { GetLocationBasedStationInfoService } from './get-location-based-station-info.service';

describe('GetLocationBasedStationInfoService', () => {
  let service: GetLocationBasedStationInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetLocationBasedStationInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
