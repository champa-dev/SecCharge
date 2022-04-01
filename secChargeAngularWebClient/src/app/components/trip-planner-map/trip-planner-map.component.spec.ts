import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripPlannerMapComponent } from './trip-planner-map.component';

describe('TripPlannerMapComponent', () => {
  let component: TripPlannerMapComponent;
  let fixture: ComponentFixture<TripPlannerMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripPlannerMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripPlannerMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
