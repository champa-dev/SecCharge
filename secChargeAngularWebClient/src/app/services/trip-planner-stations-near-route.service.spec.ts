import { TestBed } from '@angular/core/testing';

import { TripPlannerStationsNearRouteService } from './trip-planner-stations-near-route.service';

describe('TripPlannerStationsNearRouteService', () => {
  let service: TripPlannerStationsNearRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripPlannerStationsNearRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
