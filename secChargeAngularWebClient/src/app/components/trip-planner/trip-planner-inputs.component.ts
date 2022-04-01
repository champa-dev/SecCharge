import { Component, OnInit } from '@angular/core';
import { ViewChild, Input, ElementRef } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { GoogleMapsModule, MapGeocoder } from '@angular/google-maps'
import { Loader } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-trip-planner-inputs',
  templateUrl: './trip-planner-inputs.component.html',
  styleUrls: ['./trip-planner-inputs.component.css']
})
export class TripPlannerInputsComponent implements OnInit {

  private map!: google.maps.Map;

  mapOptions: google.maps.MapOptions = {
    center: { lat: 45, lng: -75 }, //ottawa
    zoom: 5
  }




  constructor() { }

  ngOnInit(): void {
    let loader = new Loader({
      apiKey: '--APIKEY--'
    })

    loader.load().then(() => {
      console.log('loaded gmaps')

      const location = { lat: 51.233334, lng: 6.783333 }

      this.map = new google.maps.Map(<HTMLInputElement>document.getElementById("map"), {
        center: { lat: 45, lng: -75 }, //ottawa
        zoom: 5
      })
    })
  }
  displayRoute(event: Event) {

  }
  refreshPage(event: Event) {
    window.location.reload();
  }
}
