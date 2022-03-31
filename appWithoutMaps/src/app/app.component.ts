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
  componentShow = false;

  constructor() {

  }

  title = 'SecCharge';

  ngOnInit(): void {
    console.log('SecCharge Web Client');

  }
  setFunc(event : Event)
  {
    this.componentShow = true
  }

}
