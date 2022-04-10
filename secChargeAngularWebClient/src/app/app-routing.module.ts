import { NrelModuleViewStationsComponent } from './components/nrel-module-view-stations/nrel-module-view-stations.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NrelModulesComponent } from './components/nrel-modules-trip-planner/nrel-modules.component';


const routes: Routes = [
  { path: 'viewStations', component: NrelModuleViewStationsComponent },
  {path: 'tripPlanner', component: NrelModulesComponent}
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forRoot(routes)]],
  exports: [RouterModule]


})
export class AppRoutingModule { }
