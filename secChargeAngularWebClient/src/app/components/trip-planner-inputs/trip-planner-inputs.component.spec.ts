import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripPlannerInputsComponent } from './trip-planner-inputs.component';

describe('TripPlannerInputsComponent', () => {
  let component: TripPlannerInputsComponent;
  let fixture: ComponentFixture<TripPlannerInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripPlannerInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripPlannerInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
