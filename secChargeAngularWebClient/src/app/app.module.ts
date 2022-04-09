import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {FormsModule} from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps'

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { DropDownComponent } from './components/view-all-stations-filters/drop-down.component';
import { DisplayMapsComponent } from './components/display-maps-for-view-stations/display-maps.component';
import { TripPlannerInputsComponent } from './components/trip-planner/trip-planner-inputs.component';
import { NrelModulesComponent } from './components/nrel-modules/nrel-modules.component';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    DropDownComponent,
    DisplayMapsComponent,
    TripPlannerInputsComponent,
    NrelModulesComponent   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    GoogleMapsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
