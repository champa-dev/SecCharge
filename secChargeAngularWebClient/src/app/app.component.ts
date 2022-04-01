import { FuelStationInfo, Response } from './Response';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DisplayMapsComponent } from './components/display-maps/display-maps.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('displayedMap') child !: DisplayMapsComponent;

  response!: Response;
  dropDownComponentShow = false;
  tripPlannerComponentShow = false;
  viewCSMapsComponentShow = true;
  tripPlannerMapsComponentShow = false;

  constructor() {

  }

  title = 'SecCharge';

  ngOnInit(): void {
    console.log('SecCharge Web Client');

  }
  setFuncDropDown(event: Event) {
    this.dropDownComponentShow = true
    this.tripPlannerComponentShow = false
  }

  setFuncTripPlanner(event: Event) {
    this.tripPlannerComponentShow = true;
    this.tripPlannerMapsComponentShow = true;
    this.viewCSMapsComponentShow = false;
  }

  refreshPage(event: Event) {
    window.location.reload();
  }

}
