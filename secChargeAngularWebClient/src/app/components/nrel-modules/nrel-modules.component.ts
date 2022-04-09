import { Response } from './../../Response';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DisplayMapsComponent } from './../../components/display-maps-for-view-stations/display-maps.component';


@Component({
  selector: 'app-nrel-modules',
  templateUrl: './nrel-modules.component.html',
  styleUrls: ['./nrel-modules.component.css']
})
export class NrelModulesComponent implements OnInit {

  title = 'SecCharge';

  @ViewChild('displayedMap') child !: DisplayMapsComponent;

  response!: Response;
  dropDownComponentShow = false;
  tripPlannerComponentShow = false;
  viewCSMapsComponentShow = true;
  tripPlannerMapsComponentShow = false;

  constructor() { }

  ngOnInit(): void {
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

}
