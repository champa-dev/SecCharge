import { Component, OnInit } from '@angular/core';
import { ViewChild, Input, ElementRef } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { GoogleMapsModule, MapGeocoder } from '@angular/google-maps'

@Component({
  selector: 'app-trip-planner-inputs',
  templateUrl: './trip-planner-inputs.component.html',
  styleUrls: ['./trip-planner-inputs.component.css']
})
export class TripPlannerInputsComponent implements OnInit {

  myLatLng = {lat: 45, lng: -75  };
  mapOptions = {
    center: this.myLatLng,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP

  };
 // map = new google.maps.Map(<HTMLInputElement>document.getElementById('googleMap'), this.mapOptions);
  @ViewChild(GoogleMap) map!: google.maps.Map;
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();


  constructor() { }

  ngOnInit(): void {
    var options = {
      types: ['(regions)']

    }

    var origin = document.getElementById("from") as HTMLInputElement;
    var autocomplete1 = new google.maps.places.Autocomplete(origin);

    var destination = document.getElementById("to") as HTMLInputElement;
    var autocomplete2 = new google.maps.places.Autocomplete(destination);

    this.directionsDisplay.setMap(this.map);
  }

  displayRoute(event: Event) {
    var request = {
      origin: (<HTMLInputElement>document.getElementById("from")!).value,
      destination: (<HTMLInputElement>document.getElementById("to")!).value,
      travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
      unitSystem: google.maps.UnitSystem.IMPERIAL
    }

    //pass the request to the route method
    this.directionsService.route(request,  (result, status) =>{
      if (status == google.maps.DirectionsStatus.OK) {

        //Get distance and time
        const output = document.querySelector('#output');
        output!.innerHTML = "<div class='alert-info'>From: " + (<HTMLOutputElement>document.getElementById("from")!).value + ".<br />To: " + (<HTMLOutputElement>document.getElementById("to")!).value + 
        ".<br /> Driving distance <i class='fas fa-road'></i> : " + result!.routes[0].legs[0].distance!.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result!.routes[0].legs[0].duration!.text + ".</div>";

        //display route
        this.directionsDisplay.setDirections(result);
        
        console.log(result)
      } else {
        //delete route from map
        this.directionsDisplay.setDirections({ routes: [] });
        //center map in London
     //   this.map.setCenter(this.myLatLng);

        const output = document.querySelector('#output');
        output!.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
      }
    });
  }

}
