import { StationObjForTripPlanner } from 'src/app/StationForTripPlanner';
import { Component, OnInit } from '@angular/core';
import { ViewChild, Input, ElementRef } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { GoogleMapsModule, MapGeocoder } from '@angular/google-maps'
import { Loader } from '@googlemaps/js-api-loader';
import { Coordinate } from 'src/app/Coordinate';
import { FuelStationInfo } from 'src/app/Response';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NearByRouteResponse } from 'src/app/NearByRouteResponse';
import { SharedService } from 'src/app/services/shared-service.service';
import { TripPlannerStationsNearRouteService } from 'src/app/services/trip-planner-stations-near-route.service';


@Component({
  selector: 'app-trip-planner-inputs',
  templateUrl: './trip-planner-inputs.component.html',
  styleUrls: ['./trip-planner-inputs.component.css']
})
export class TripPlannerInputsComponent implements OnInit {

  private map!: google.maps.Map;

  response!: NearByRouteResponse;
  mapMarkers: google.maps.Marker[] = [];

  directionsService = new google.maps.DirectionsService();

  //create a DirectionsRenderer object which we will use to display the route
  directionsDisplay = new google.maps.DirectionsRenderer();

  displayFiltersComponentVar: boolean = false;

  // drop down vars
  coordsFromLevelFilterForMaps: StationObjForTripPlanner[] = [];
  curStateOfLevelFilter: string[] = [];

  coordsFromConnectorFilterForMaps: StationObjForTripPlanner[] = [];
  curStateOfConnectorFilter: string[] = [];

  coordsFromNetworkFilterForMaps: StationObjForTripPlanner[] = [];
  curStateOfNetworkFilter: string[] = [];

  dropdownSettings!: IDropdownSettings;
  levelDropdownList = [
    { item_id: 1, item_text: 'Level 1' },
    { item_id: 2, item_text: 'Level 2' },
    { item_id: 3, item_text: 'DC Fast' },
    { item_id: 4, item_text: 'Legacy Chargers' }
  ];
  levelSelectedItems = [

  ];

  connectorDropdownList = [
    { item_id: 1, item_text: 'NEMA1450' },
    { item_id: 2, item_text: 'NEMA515' },
    { item_id: 3, item_text: 'NEMA520' },
    { item_id: 4, item_text: 'J1772' },
    { item_id: 5, item_text: 'J1772COMBO' },
    { item_id: 6, item_text: 'CHADEMO' },
    { item_id: 7, item_text: 'TESLA' }

  ];
  connectorSelectedItems = [

  ];

  networkDropdownList = [
    { item_id: 2, item_text: 'AddÉnergie Technologies' },
    { item_id: 3, item_text: 'AMPUP' },
    { item_id: 4, item_text: 'BCHYDRO' },
    { item_id: 5, item_text: 'Blink Network' },
    { item_id: 6, item_text: 'CHARGELAB' },
    { item_id: 7, item_text: 'ChargePoint Network' },
    { item_id: 8, item_text: 'Circuit électrique' },
    { item_id: 9, item_text: 'eCharge Network' },
    { item_id: 10, item_text: 'Electrify Canada' },
    { item_id: 11, item_text: 'EVCS' },
    { item_id: 12, item_text: 'EV Connect' },
    { item_id: 13, item_text: 'EVGATEWAY' },
    { item_id: 14, item_text: 'eVgo Network' },
    { item_id: 15, item_text: 'FLO' },
    { item_id: 16, item_text: 'FPLEV' },
    { item_id: 17, item_text: 'FCN' },
    { item_id: 18, item_text: 'Greenlots' },
    { item_id: 19, item_text: 'IVY' },
    { item_id: 20, item_text: 'LIVINGSTON' },
    { item_id: 22, item_text: 'Non-Networked' },
    { item_id: 23, item_text: 'OpConnect' },
    { item_id: 24, item_text: 'PETROCAN' },
    { item_id: 25, item_text: 'POWERFLEX' },
    { item_id: 26, item_text: 'RIVIAN_WAYPOINTS' },
    { item_id: 27, item_text: 'SemaCharge Network' },
    { item_id: 28, item_text: 'Sun Country Highway' },
    { item_id: 29, item_text: 'Tesla Destination' },
    { item_id: 30, item_text: 'SWTCH' },
    { item_id: 31, item_text: 'Tesla' },
    { item_id: 32, item_text: 'Volta' },
    { item_id: 33, item_text: 'Webasto' },
    { item_id: 34, item_text: 'ZEFNET' }


  ];
  networkSelectedItems = [

  ];

  constructor(private getInfoFromNearByRouteService: TripPlannerStationsNearRouteService) { }

  ngOnInit(): void {

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true
    };

    let loader = new Loader({
      apiKey: 'AIzaSyCKOIlrdqH_DOrj_kKCVLYFG5gjoJDG0kc'
    })

    loader.load().then(() => {
      console.log('loaded gmaps')

      const location = { lat: 51.233334, lng: 6.783333 }

      this.map = new google.maps.Map(<HTMLInputElement>document.getElementById("map"), {
        center: { lat: 45, lng: -75 }, //ottawa
        zoom: 8,
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
  displayRoute(filterUrlPart: string) {

    console.log("Filters URL below****")
    console.log(filterUrlPart)

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
        output!.innerHTML = "<div  font-size: 140px;><b>From: </b>" + (<HTMLInputElement>document.getElementById("from")!).value
          + ".<br /><b>To: </b>" + (<HTMLInputElement>document.getElementById("to")!).value + ".<br /> <b>Driving distance <i class='fas fa-road'></i> :</b> "
          + result!.routes[0].legs[0].distance!.text + ".<br /><b>Duration <i class='fas fa-hourglass-start'></i> : </b>"
          + result!.routes[0].legs[0].duration!.text + ".</div>";

        //display route
        this.directionsDisplay.setDirections(result);

        //display stuff for debugging
        console.log("route result from google api")
        console.log(result?.routes[0])
        console.log("encoded polyline below")
        console.log(result?.routes[0].overview_polyline!)

        //fetch station info from api
        let customUrlPart = this.constructWKT(this.decodePolyline(result?.routes[0].overview_polyline!)).concat(filterUrlPart);

        //console.log(result?.routes[0].legs[0].steps)
        //display stuff for debugging
        console.log("decoded latLong below")
        console.log(customUrlPart)
        //call service
        this.getInfoFromNearByRouteService.getStationInfoForRoutes(customUrlPart).subscribe((info) => {

          this.response = info;
          let stationsNearByRoute: StationObjForTripPlanner[] = [];

          for (let i = 0; i < this.mapMarkers.length; i++) {
            this.mapMarkers[i].setMap(null);
          }

          console.log(this.response.station_counts)

          this.response.fuel_stations.forEach((station: FuelStationInfo) => {
            /*  console.log('Station Name:', station.station_name,
                '**Station network:', station.ev_network,
                '**Station connector type:', station.ev_connector_types,
                '**Latitude', station.latitude,
                '**Longitude', station.longitude, '\n');*/

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
            stationsNearByRoute.push(statObj);
            //   console.log(statObj.stationLocCoord)
          }

          );

          // set marker
          for (let i = 0; i < stationsNearByRoute.length; i++) {
            const marker = new google.maps.Marker({
              position: stationsNearByRoute[i].stationLocCoord,
              icon: { url: stationsNearByRoute[i].color },
              map: this.map,
            });
            this.mapMarkers.push(marker);


            //set infowindow
            let infowindow = new google.maps.InfoWindow()
            let content =
              "<div>" +
              "<h1>" + stationsNearByRoute[i].stationName + "</h1>" +
              "<br>" +
              "<h2>" +
              "<div>Availabilty </div>" + stationsNearByRoute[i].stationHrs +
              "</h2>" +
              "<h2>" +
              "<div>Address </div>" + stationsNearByRoute[i].stationAddress.concat(", ")
                .concat(stationsNearByRoute[i].stationCity).concat(", ").concat(stationsNearByRoute[i].stationZip) +
              " </h2>" +
              " <h2>" +
              "<div>Phone </div>" + stationsNearByRoute[i].stationPhone +
              " </h2>" +

              "<h2>" +
              " <div>Pricing </div>" + stationsNearByRoute[i].stationPricing +
              " </h2>" +
              " </div>";

            let tempMap = this.map

            google.maps.event.addListener(marker, 'click', ((marker, content, infowindow) => {
              return function () {

                infowindow.setContent(content);
                infowindow.open(tempMap, marker);
              };
            })(marker, content, infowindow));
          }
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
    })

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
    let lat = 0, lng = 0;

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
      //   console.log(point.latitude + " " + point.longitude);
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

    if (statObj.stationL2Num != null) statObj.color = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    else if (statObj.stationL1Num != null) statObj.color = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    else if (statObj.stationDCNum != null) statObj.color = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    else statObj.color = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'

    return statObj.color;
  }

  displayFiltersComponent(event: Event) {
    this.displayFiltersComponentVar = true;
  }

  constructFilterUrl(lineStringPart: string): string {

    let filterUrlVar = lineStringPart;

    return filterUrlVar;


  }

  onNetworkSelect(item: any) {

    this.curStateOfNetworkFilter.push(item.item_text);
    let selectedNetworkUrl = '&ev_network='

    for (let network of this.curStateOfNetworkFilter) {
      selectedNetworkUrl = selectedNetworkUrl.concat(network).concat(",");

    }

    console.log("curStateOfNetworkFilter below****")
    console.log(this.curStateOfNetworkFilter)
    console.log("URL below****")
    console.log(selectedNetworkUrl)

    this.displayRoute(selectedNetworkUrl)

  }

  onNetworkSelectAll(items: any) {

    let allNetworkurl = '&ev_network=all';
    this.displayRoute(allNetworkurl)
    console.log(items);
  }

  onNetworkDeSelect(item: any) {

    /* console.log(item)
 
     for (let network of this.curStateOfNetworkFilter) {
       if (item.item_text.toString() == network.toString())
         console.log("Found")
 
     }*/

    this.curStateOfNetworkFilter = this.curStateOfNetworkFilter.filter(e => e !== item.item_text)

    if (!(this.curStateOfNetworkFilter.length == 0)) {
      console.log('Hereeee')
      this.curStateOfNetworkFilter.push(item.item_text);
      let deSelectNetworkUrl = '&ev_network='

      for (let i = 0; i < this.curStateOfNetworkFilter.length; i++) {
        if (item.item_text.toString() == this.curStateOfNetworkFilter[i].toString()) {
          this.curStateOfNetworkFilter.splice(i, 1); // 2nd parameter means remove one item only          
        }

      }

      for (let network of this.curStateOfNetworkFilter) {
        if (item.item_text.toString() != network.toString())
          deSelectNetworkUrl = deSelectNetworkUrl.concat(network).concat(",");

      }

      console.log("curStateOfNetworkFilter below****")
      console.log(this.curStateOfNetworkFilter)
      console.log("URL below****")
      console.log(deSelectNetworkUrl)

      this.displayRoute(deSelectNetworkUrl)
    }

    else {
      this.clearMapForNetworkFilter()
    }

  }

  onNetworkDeSelectAll(items: any) {
    this.clearMapForNetworkFilter()
  }

  clearMapForNetworkFilter() {
    this.curStateOfNetworkFilter = [];
    this.displayRoute('')

  }

  onConnectorSelect(item: any) {

    this.curStateOfConnectorFilter.push(item.item_text);
    let selectedConnectorUrl = '&ev_connector_type='

    for (let connector of this.curStateOfConnectorFilter) {
      selectedConnectorUrl = selectedConnectorUrl.concat(connector).concat(",");

    }

    this.displayRoute(selectedConnectorUrl)

  }

  onConnectorSelectAll(items: any) {

    let allConnectorUrl = '&ev_connector_type=all';
    this.displayRoute(allConnectorUrl)
    console.log(items);

  }

  onConnectorDeSelect(item: any) {


    this.curStateOfConnectorFilter = this.curStateOfConnectorFilter.filter(e => e !== item.item_text)


    if (!(this.curStateOfConnectorFilter.length == 0)) {

      this.curStateOfConnectorFilter.push(item.item_text);
      let deSelectConnectorUrl = '&ev_connector_type='

      for (let i = 0; i < this.curStateOfConnectorFilter.length; i++) {
        if (item.item_text.toString() == this.curStateOfConnectorFilter[i].toString()) {
          this.curStateOfConnectorFilter.splice(i, 1); // 2nd parameter means remove one item only          
        }

      }

      for (let connector of this.curStateOfConnectorFilter) {
        if (item.item_text.toString() != connector.toString())
          deSelectConnectorUrl = deSelectConnectorUrl.concat(connector).concat(",");

      }

      this.displayRoute(deSelectConnectorUrl)

    }
    else {
      this.clearMapForConnectorFilter()
    }
  }

  clearMapForConnectorFilter() {
    this.curStateOfConnectorFilter = [];
    this.displayRoute('')
  }

  onConnectorDeSelectAll(items: any) {
    this.clearMapForConnectorFilter()
  }

  onLevelSelect(item: any) {

    this.curStateOfLevelFilter.push(item.item_text.toString());
    console.log("curStateOfNetworkFilter below****")
    console.log(this.curStateOfLevelFilter)

    let selectLevelUrl = '&ev_charging_level=';

    for (let itemLevel of this.curStateOfLevelFilter) {

      switch (itemLevel) {

        case 'Level 1':
          selectLevelUrl = selectLevelUrl.concat('1').concat(',');
          break;

        case 'Level 2':
          selectLevelUrl = selectLevelUrl.concat('2').concat(',');
          break;

        case 'DC Fast':
          selectLevelUrl = selectLevelUrl.concat('dc_fast').concat(',');
          break;

        case 'Legacy Chargers':
          selectLevelUrl = selectLevelUrl.concat('legacy').concat(',');
          break;

        default:
          selectLevelUrl = '';
      }

    }
    this.displayRoute(selectLevelUrl)
  }

  onLevelDeSelect(item: any) {
    //  console.log('In deslect: ' + item.item_text)
    //  console.log('Before switch exec: ' + this.curStateOfLevelFilter);
 //   this.curStateOfLevelFilter = this.curStateOfLevelFilter.filter(e => e !== item.item_text)

    console.log('In level deselect')

    if (!(this.curStateOfLevelFilter.length == 0)) {
    //  console.log('Hereeee')
      
      let deSelectLevelUrl = '&ev_charging_level=';

      for (let i = 0; i < this.curStateOfLevelFilter.length; i++) {
        if (item.item_text.toString() == this.curStateOfLevelFilter[i].toString()) {
          console.log("match at"+i)
          this.curStateOfLevelFilter.splice(i, 1); // 2nd parameter means remove one item only          
        }
      }
  

      console.log("curStateOfNetworkFilter below****")
      console.log(this.curStateOfLevelFilter)

      for (let level of this.curStateOfLevelFilter) {
        if (item.item_text.toString() != level.toString()){
          switch (level) {

            case 'Level 1':
              deSelectLevelUrl = deSelectLevelUrl.concat('1').concat(',');
              break;
    
            case 'Level 2':
              deSelectLevelUrl = deSelectLevelUrl.concat('2').concat(',');
              break;
    
            case 'DC Fast':
              deSelectLevelUrl = deSelectLevelUrl.concat('dc_fast').concat(',');
              break;
    
            case 'Legacy Chargers':
              deSelectLevelUrl = deSelectLevelUrl.concat('legacy').concat(',');
              break;
    
          }
        }

      }

   
      console.log("URL below****")
      console.log(deSelectLevelUrl)

      this.displayRoute(deSelectLevelUrl)
    }

    else {
      this.clearMapForLevelFilter()
    }
  }


  onLevelDeSelectAll(items: any) {
    this.clearMapForLevelFilter();
  }

  clearMapForLevelFilter() {
    this.curStateOfLevelFilter = [];
    this.displayRoute('')
  }

  onLevelSelectAll(items: any) {
    let allLevelurl = '&ev_charging_level=all';
    this.displayRoute(allLevelurl)
    console.log(items);

  }
}

