import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NrelModulesComponent } from './components/nrel-modules/nrel-modules.component';


const routes: Routes = [
  { path: 'viewStations', component: NrelModulesComponent }
]

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forRoot(routes)]],
  exports: [RouterModule]


})
export class AppRoutingModule { }
