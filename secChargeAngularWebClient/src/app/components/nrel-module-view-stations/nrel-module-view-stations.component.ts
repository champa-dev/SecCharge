import { Response } from '../../Response';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DisplayMapsComponent } from '../display-maps-for-view-stations/display-maps.component';


@Component({
  selector: 'app-nrel-module-view-stations',
  templateUrl: './nrel-module-view-stations.component.html',
  styleUrls: ['./nrel-module-view-stations.component.css']
})
export class NrelModuleViewStationsComponent implements OnInit {

  title = 'SecCharge';

  @ViewChild('displayedMap') child !: DisplayMapsComponent;

  response!: Response;
  dropDownComponentShow = false;
  viewCSMapsComponentShow = true;

  constructor() { }

  ngOnInit(): void {
  }
  setFuncDropDown(event: Event) {
    this.dropDownComponentShow = true

  }


}
