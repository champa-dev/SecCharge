import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {FormsModule} from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps'

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { DropDownComponent } from './components/drop-down/drop-down.component';
import { DisplayMapsComponent } from './components/display-maps/display-maps.component';


@NgModule({
  declarations: [
    AppComponent,
    DropDownComponent,
    DisplayMapsComponent
   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
