import { StationObjForTripPlanner } from './../../StationForTripPlanner';
import { Component, OnInit } from '@angular/core';
import { ViewChild, Input, ElementRef } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { GoogleMapsModule, MapGeocoder } from '@angular/google-maps'
import { Loader } from '@googlemaps/js-api-loader';
import { Coordinate } from 'src/app/Coordinate';
import { NearByRouteResponse } from 'src/app/NearbyRouteResponse';
import { FuelStationInfo } from 'src/app/Response';
import { TripPlannerStationsNearRouteService } from 'src/app/services/trip-planner-stations-near-route.service';


@Component({
  selector: 'app-trip-planner-inputs',
  templateUrl: './trip-planner-inputs.component.html',
  styleUrls: ['./trip-planner-inputs.component.css']
})
export class TripPlannerInputsComponent implements OnInit {

  private map!: google.maps.Map;

  response!: NearByRouteResponse;
  coordsForStationsNearByRoutesService: StationObjForTripPlanner[] = [];
  

  directionsService = new google.maps.DirectionsService();

  //create a DirectionsRenderer object which we will use to display the route
  directionsDisplay = new google.maps.DirectionsRenderer();

  constructor(private getInfoFromNearByRouteService: TripPlannerStationsNearRouteService) { }

  ngOnInit(): void {
    let loader = new Loader({
      apiKey: '--APIKEY--'
    })

    loader.load().then(() => {
      console.log('loaded gmaps')

      const location = { lat: 51.233334, lng: 6.783333 }

      this.map = new google.maps.Map(<HTMLInputElement>document.getElementById("map"), {
        center: { lat: 45, lng: -75 }, //ottawa
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      })


      //bind the DirectionsRenderer to the map
      this.directionsDisplay.setMap(this.map);

      var options = {
        types: []
      }

      var from = <HTMLInputElement>document.getElementById("from");
      var autocomplete1 = new google.maps.places.Autocomplete(from, options);

      var to = <HTMLInputElement>document.getElementById("to");
      var autocomplete2 = new google.maps.places.Autocomplete(to, options);

    })
  }
  displayRoute(event: Event) {
    var request = {
      origin: (<HTMLInputElement>document.getElementById("from")!).value,
      destination: (<HTMLInputElement>document.getElementById("to")!).value,
      travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
      unitSystem: google.maps.UnitSystem.IMPERIAL
    }

    //pass the request to the route method
    this.directionsService.route(request, (result, status) => {

      const output = document.querySelector('#output');
      if (status == google.maps.DirectionsStatus.OK) {

        //Get distance and time        
        output!.innerHTML = "<div class='alert-info'>From: " + (<HTMLInputElement>document.getElementById("from")!).value
          + ".<br />To: " + (<HTMLInputElement>document.getElementById("to")!).value + ".<br /> Driving distance <i class='fas fa-road'></i> : "
          + result!.routes[0].legs[0].distance!.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : "
          + result!.routes[0].legs[0].duration!.text + ".</div>";

        //display route
        this.directionsDisplay.setDirections(result);

        //display stuff for debugging
        console.log("route result from google api")
        console.log(result?.routes[0])
        console.log("encoded polyline below")
        console.log(result?.routes[0].overview_polyline!)

        //fetch station info from api
        let customUrlPart = this.constructWKT(this.decodePolyline(result?.routes[0].overview_polyline!));
        //display stuff for debugging
        console.log("decoded latLong below")
        console.log(customUrlPart)
        //call service
        this.getInfoFromNearByRouteService.getStationInfoForRoutes(customUrlPart).subscribe((info) => {
          this.response = info;
          console.log(this.response.station_counts)
          this.response.fuel_stations.forEach((station: FuelStationInfo) => {
            console.log('Station Name:', station.station_name,
              '**Station network:', station.ev_network,
              '**Station connector type:', station.ev_connector_types,
              '**Latitude', station.latitude,
              '**Longitude', station.longitude, '\n');

            let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

            let statObj: StationObjForTripPlanner = {
              stationId: station.id, stationLocCoord: coord, stationPhone: station.station_phone,
              stationName: station.station_name, stationAddress: station.street_address, stationCity: station.city,
              stationState: station.state, stationZip: station.zip, stationHrs: station.access_days_time,
              stationPricing: station.ev_pricing, stationRenewableSource: station.ev_renewable_source,
              stationDCNum: station.ev_dc_fast_num, stationL1Num: station.ev_level1_evse_num,
              stationL2Num: station.ev_level2_evse_num, stationEVNetwork: station.ev_network, stationConnectorTypes: station.ev_connector_types, color: ""
            }
            statObj.color = this.setMarkerIcon(statObj);
            this.coordsForStationsNearByRoutesService.push(statObj);
            console.log(this.coordsForStationsNearByRoutesService);
          }
          );
        }
        );

      }
      else {
        //delete route from map
        this.directionsDisplay.setDirections({ routes: [] });
        //center map in Ottawa
        this.map.setCenter({ lat: 45, lng: -75 });

        //show error message
        output!.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
      }
    }
    );

  }
  refreshPage(event: Event) {
    window.location.reload();
  }

  decodePolyline(encoded: string) {
    if (!encoded) {
      return [];
    }
    var poly = [];
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;

    while (index < len) {
      var b, shift = 0, result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result = result | ((b & 0x1f) << shift);
        shift += 5;
      } while (b >= 0x20);

      var dlat = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
      lat += dlat;

      shift = 0;
      result = 0;

      do {
        b = encoded.charCodeAt(index++) - 63;
        result = result | ((b & 0x1f) << shift);
        shift += 5;
      } while (b >= 0x20);

      var dlng = (result & 1) != 0 ? ~(result >> 1) : (result >> 1);
      lng += dlng;

      var p = {
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      };
      poly.push(p);
    }
    return poly;
  }

  constructWKT(routeLine: { latitude: number, longitude: number }[]): string {
    let customLineString: string = "&distance=2&route=LINESTRING(";

    for (let point of routeLine) {
      console.log(point.latitude + " " + point.longitude);
      if (point.longitude > 0)
        customLineString = customLineString.concat("+")
      customLineString = customLineString.concat(point.longitude.toString())
      if (point.latitude > 0)
        customLineString = customLineString.concat("+")
      customLineString = customLineString.concat(point.latitude.toString())
      customLineString = customLineString.concat(",")
    }

    customLineString = customLineString.slice(0, -1);
    customLineString = customLineString.concat(")")

    return customLineString;

  }
  setMarkerIcon(statObj: StationObjForTripPlanner): string {

    if (statObj.stationL2Num != null) statObj.color = 'http://maps.google.com/mapfiles/kml/pal4/icon7.png' //red
    else if (statObj.stationL1Num != null) statObj.color = 'http://maps.google.com/mapfiles/kml/pal4/icon54.png' //green
    else if (statObj.stationDCNum != null) statObj.color = 'http://maps.google.com/mapfiles/kml/pal4/icon23.png' //yellow
    else statObj.color = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'

    return statObj.color;
  }
}
