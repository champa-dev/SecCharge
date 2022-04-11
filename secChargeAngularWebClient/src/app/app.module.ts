import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {FormsModule} from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps'
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { DropDownComponent } from './components/view-all-stations-filters/drop-down.component';
import { DisplayMapsComponent } from './components/display-maps-for-view-stations/display-maps.component';
import { TripPlannerInputsComponent } from './components/trip-planner/trip-planner-inputs.component';
import { AppRoutingModule } from './app-routing.module';
import { NO_ERRORS_SCHEMA} from '@angular/core';


@NgModule({
  declarations: [
    AppComponent,
    DropDownComponent,
    DisplayMapsComponent,
    TripPlannerInputsComponent,
     
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    GoogleMapsModule,
    AppRoutingModule,
    CommonModule,
    NgMultiSelectDropDownModule
  ],
  schemas:[NO_ERRORS_SCHEMA], 
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
