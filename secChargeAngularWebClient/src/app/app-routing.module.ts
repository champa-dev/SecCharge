import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DisplayMapsComponent } from './components/display-maps-for-view-stations/display-maps.component';
import { TripPlannerInputsComponent } from './components/trip-planner/trip-planner-inputs.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes: Routes = [
  { path: 'viewStations', component: DisplayMapsComponent },
  {path: 'tripPlanner', component: TripPlannerInputsComponent}
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forRoot(routes)],
    ],
  exports: [RouterModule]


})
export class AppRoutingModule { }
