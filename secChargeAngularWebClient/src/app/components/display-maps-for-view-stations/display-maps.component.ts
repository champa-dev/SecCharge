import { StationObj } from 'src/app/Station';
import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { SharedService } from 'src/app/services/shared-service.service';
import { Subscription } from 'rxjs'
import { Coordinate } from 'src/app/Coordinate';
import { GetLocationBasedStationInfoService } from 'src/app/services/get-location-based-station-info.service';
import { Response, FuelStationInfo } from 'src/app/Response';
import { NearestStationResponse } from 'src/app/NearestStationResponse';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Loader } from '@googlemaps/js-api-loader';
import { GetInfoFromDropDownService } from '../../services/get-info-from-drop-down.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';




@Component({
  selector: 'app-display-maps',
  templateUrl: './display-maps.component.html',
  styleUrls: ['./display-maps.component.css'],

})
export class DisplayMapsComponent implements OnInit {

  showMsg = false;
  response!: NearestStationResponse;

  private gmap!: google.maps.Map;
  mapMarkers: google.maps.Marker[] = [];

  coordsFromNearestStationService: StationObj[] = [];
  markerIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  //"{icon:{url:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}}"

  connectorSelectEventSubscription!: Subscription;
  networkSelectEventSubscription!: Subscription;
  levelSelectEventSubscription!: Subscription;


  connectorFilterStations: StationObj[] = [];
  networkFilterStations: StationObj[] = [];
  levelFileterStations: StationObj[] = [];

  coordsFromConnectorFilterFormSearchLoc: StationObj[] = [];
  curStateOfConnectorFilterFromSearchLoc: string[] = [];

  coordsFromNetworkFilterFormSearchLoc: StationObj[] = [];
  curStateOfNetworkFilterFromSearchLoc: string[] = [];

  dropdownSettings!: IDropdownSettings;
  dropDownComponentShow = false

  coordsFromLevelFilterForMaps: StationObj[] = [];
  curStateOfLevelFilter: string[] = [];

  coordsFromConnectorFilterForMaps: StationObj[] = [];
  curStateOfConnectorFilter: string[] = [];

  coordsFromNetworkFilterForMaps: StationObj[] = [];
  curStateOfNetworkFilter: string[] = [];

  // dropdownSettings!: IDropdownSettings;
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

  responseForAllStations!: Response;

  stationsToBeMarked: StationObj[] = [];
  locSearched!: string

  constructor(private getInfoFromDropDownService: GetInfoFromDropDownService, private sharedService: SharedService, private getNearestLocationInfoService: GetLocationBasedStationInfoService) {


    this.connectorSelectEventSubscription = this.sharedService.getConnectorSelectEvent().subscribe((value: StationObj[]) => {
      this.connectorDataRefresh(value);
    });
    console.log('ConnectorFilter:')
    console.log(this.connectorFilterStations);

    this.networkSelectEventSubscription = this.sharedService.getNetworkSelectEvent().subscribe((value: StationObj[]) => {
      this.networkDataRefresh(value);
    });
    console.log('NetworkFilter:')
    console.log(this.networkFilterStations);
  }
  
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

      this.gmap = new google.maps.Map(<HTMLInputElement>document.getElementById("map"), {
        center: { lat: 45, lng: -75 }, //ottawa
        zoom: 7,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      })

      //  this.directionsDisplay.setMap(this.map);

      var options = {
        types: []
      }

      const input = document.getElementById("search") as HTMLInputElement;
      const searchBox = new google.maps.places.SearchBox(input);
      this.gmap.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

      console.log('here7&')
      searchBox.addListener('places_changed', () => {
        this.dropDownComponentShow = false;
        const places = searchBox.getPlaces();
        if (places?.length === 0) {
          return;
        }
        console.log('In places changed')
        const bounds = new google.maps.LatLngBounds();
        places?.forEach(place => {
          if (!place.geometry || !place.geometry.location)
            return;
          if (place.geometry.viewport) {

            bounds.union(place.geometry.viewport);
            console.log(place.formatted_address)
            this.showMsg = true;

            let locAddr: string = place.formatted_address?.toString()!;
            this.locSearched = '&location='.concat(locAddr);

            this.updateMapMarkersBeasedOnSearchedLoc();

          }
          else
            bounds.extend(place.geometry.location)
        })
        this.gmap.fitBounds(bounds)
      })


      //add search box and map and its css      

    })
  }

  setFuncDropDown(event: Event) {
    this.dropDownComponentShow = true
  }

  connectorDataRefresh(value: StationObj[]) {
    this.connectorFilterStations = value;
    console.log(this.connectorFilterStations)
    this.stationsToBeMarked = this.connectorFilterStations;
  }

  networkDataRefresh(value: StationObj[]) {
    this.networkFilterStations = value;
    this.stationsToBeMarked = this.networkFilterStations;
  }

  levelDataRefresh(value: StationObj[]) {
    //this.levelFileterStations = value;
    /* this.stationsToBeMarked = value;
     console.log('filled Data%%%%%%%%%%%%%%%%%%%%')
     this.setMarkers()*/

    this.sharedService.getLevelSelectEvent().subscribe((value: StationObj[]) => {
      //this.levelDataRefresh(value);

      this.stationsToBeMarked = value;
      console.log('filled Data%%%%%%%%%%%%%%%%%%%%')
      this.setMarkers()


    });

  }

  ngOnDestroy() {

    this.connectorSelectEventSubscription.unsubscribe();
    this.networkSelectEventSubscription.unsubscribe();
  }

  infowindow = new google.maps.InfoWindow();

  setMarkers() {

    console.log(this.stationsToBeMarked.length)
    console.log(this.stationsToBeMarked)



    while (this.mapMarkers.length) {
      let x = this.mapMarkers.pop()!
      x.setMap(null);
    }

    for (let i = 0; i < this.stationsToBeMarked.length; i++) {
      const marker = new google.maps.Marker({
        position: this.stationsToBeMarked[i].stationLocCoord,
        map: this.gmap,
        icon: { url: this.stationsToBeMarked[i].color }
      });

      this.mapMarkers.push(marker);

      let infowindow = new google.maps.InfoWindow()
      let content =
        "<div>" +
        "<h1>" + this.stationsToBeMarked[i].stationName + "</h1>" +
        "<br>" +
        "<h2>" +
        "<div>Availabilty </div>" + this.stationsToBeMarked[i].stationHrs +
        "</h2>" +
        "<h2>" +
        "<div>Address </div>" + this.stationsToBeMarked[i].stationAddress.concat(", ")
          .concat(this.stationsToBeMarked[i].stationCity).concat(", ").concat(this.stationsToBeMarked[i].stationZip) +
        " </h2>" +
        " <h2>" +
        "<div>Phone </div>" + this.stationsToBeMarked[i].stationPhone +
        " </h2>" +

        "<h2>" +
        " <div>Pricing </div>" + this.stationsToBeMarked[i].stationPricing +
        " </h2>" +
        " </div>";

      let tempMap = this.gmap

      google.maps.event.addListener(marker, 'click', ((marker, content, infowindow) => {
        return function () {

          infowindow.setContent(content);
          infowindow.open(tempMap, marker);
        };
      })(marker, content, infowindow));

    }
    console.log(this.mapMarkers)
  }


  ngAfterViewInit(): void {

  }

  updateMapMarkersBeasedOnSearchedLoc() {
    this.getNearestLocationInfoService.getStationInfoFromSearchedLoc(this.locSearched).subscribe((info) => {
      this.response = info;

      this.coordsFromNearestStationService = [];
      this.response.fuel_stations.forEach((station: FuelStationInfo) => {
        /* console.log('Station Name:', station.station_name,
           '**Station network:', station.ev_network,
           '**Station connector type:', station.ev_connector_types,
           '**Latitude', station.latitude,
           '**Longitude', station.longitude, '\n');*/

        let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

        let statObj: StationObj = {
          stationId: station.id, stationLocCoord: coord, stationPhone: station.station_phone,
          stationName: station.station_name, stationAddress: station.street_address, stationCity: station.city,
          stationState: station.state, stationZip: station.zip, stationHrs: station.access_days_time,
          stationPricing: station.ev_pricing, stationRenewableSource: station.ev_renewable_source,
          stationDCNum: station.ev_dc_fast_num, stationL1Num: station.ev_level1_evse_num,
          stationL2Num: station.ev_level2_evse_num, color: ""
        };
        statObj.color = this.setMarkerIcon(statObj)
        this.coordsFromNearestStationService.push(statObj);
      }
      );
      // console.log(this.coordsFromNearestStationService);
      this.stationsToBeMarked = this.coordsFromNearestStationService;
      let x = this.coordsFromNearestStationService;
      console.log(this.stationsToBeMarked)
      this.setMarkers()
      //  console.log(this.stationsToBeMarked)
      //  console.log(x)
    });

  }

  onLocConnectorSelect(item: any) {

    this.curStateOfConnectorFilterFromSearchLoc.push(item.item_text);
    let selectedConnectorUrl = this.locSearched.concat('&ev_connector_type=');
    console.log(selectedConnectorUrl)

    for (let connector of this.curStateOfConnectorFilterFromSearchLoc) {
      selectedConnectorUrl = selectedConnectorUrl.concat(connector).concat(",");

    }

    this.getNearestLocationInfoService.getStationInfoFromSearchedLoc(selectedConnectorUrl).subscribe((info) => {
      this.response = info;

      this.response.fuel_stations.forEach((station: FuelStationInfo) => {

        /*console.log('Station Name:', station.station_name,
          '**Station network:', station.ev_network,
          '**Station connector type:', station.ev_connector_types,
          '**Latitude', station.latitude,
          '**Longitude', station.longitude, '\n');*/

        let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

        let statObj: StationObj = {
          stationId: station.id, stationLocCoord: coord, stationPhone: station.station_phone,
          stationName: station.station_name, stationAddress: station.street_address, stationCity: station.city,
          stationState: station.state, stationZip: station.zip, stationHrs: station.access_days_time,
          stationPricing: station.ev_pricing, stationRenewableSource: station.ev_renewable_source,
          stationDCNum: station.ev_dc_fast_num, stationL1Num: station.ev_level1_evse_num,
          stationL2Num: station.ev_level2_evse_num, color: ""
        };
        statObj.color = this.setMarkerIcon(statObj)
        this.coordsFromConnectorFilterFormSearchLoc.push(statObj);
      })
      this.stationsToBeMarked = this.coordsFromConnectorFilterFormSearchLoc;
      this.setMarkers()
    }
    );

  }

  onLocConnectorSelectAll(items: any) {

    let allConnectorUrl = '&ev_connector_type=all';
    allConnectorUrl = this.locSearched.concat(allConnectorUrl);
    console.log(allConnectorUrl)

    this.getNearestLocationInfoService.getStationInfoFromSearchedLoc(allConnectorUrl).subscribe((info) => {
      this.response = info;

      this.response.fuel_stations.forEach((station: FuelStationInfo) => {

        /* console.log('Station Name:', station.station_name,
           '**Station network:', station.ev_network,
           '**Station connector type:', station.ev_connector_types,
           '**Latitude', station.latitude,
           '**Longitude', station.longitude, '\n');*/

        let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

        let statObj: StationObj = {
          stationId: station.id, stationLocCoord: coord, stationPhone: station.station_phone,
          stationName: station.station_name, stationAddress: station.street_address, stationCity: station.city,
          stationState: station.state, stationZip: station.zip, stationHrs: station.access_days_time,
          stationPricing: station.ev_pricing, stationRenewableSource: station.ev_renewable_source,
          stationDCNum: station.ev_dc_fast_num, stationL1Num: station.ev_level1_evse_num,
          stationL2Num: station.ev_level2_evse_num, color: ""
        }
        statObj.color = this.setMarkerIcon(statObj)
        this.coordsFromConnectorFilterFormSearchLoc.push(statObj);
      }
      );
      console.log(this.coordsFromConnectorFilterFormSearchLoc);
      this.stationsToBeMarked = this.coordsFromConnectorFilterFormSearchLoc
      console.log('Connector select all exec')
      this.setMarkers()
    }
    );
    console.log(items);
  }
  onLocNetworkDeSelect(item: any) {

    let deSelectNetworkUrl = '&ev_network=';
    deSelectNetworkUrl = deSelectNetworkUrl.concat(item.item_text);
    deSelectNetworkUrl = this.locSearched.concat(deSelectNetworkUrl);
    console.log(deSelectNetworkUrl)

    this.curStateOfNetworkFilterFromSearchLoc = this.curStateOfNetworkFilterFromSearchLoc.filter(e => e !== item.item_text)

    if (!(this.curStateOfNetworkFilterFromSearchLoc.length == 0)) {

      console.log('String to be passed:Getting the coords to be removed ' + deSelectNetworkUrl);

      this.getNearestLocationInfoService.getStationInfoFromSearchedLoc(deSelectNetworkUrl).subscribe((info) => {
        this.response = info;

        this.response.fuel_stations.forEach((station: FuelStationInfo) => {

          console.log('Station Name:', station.station_name,
            '**Station network:', station.ev_network,
            '**Station connector type:', station.ev_connector_types,
            '**Latitude', station.latitude,
            '**Longitude', station.longitude, '\n');

          let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

          console.log('Cood to be eliminated ');
          console.log(coord)

          let i = -1;
          this.coordsFromNetworkFilterFormSearchLoc.forEach(ord => {

            i++;
            if (ord.stationLocCoord.lat == coord.lat && ord.stationLocCoord.lng == coord.lng) {
              console.log(ord);
              this.coordsFromNetworkFilterFormSearchLoc.splice(i, 1);
            }

          });
          console.log('Final list after removal');
          console.log(this.coordsFromNetworkFilterFormSearchLoc)
        }
        )
        this.stationsToBeMarked = this.coordsFromNetworkFilterFormSearchLoc;
        this.setMarkers()
      });

      //this.sharedService.sendConnectorSelect(this.coordsFromNetworkFilterFormSearchLoc);
    }
    else {
      this.clearMapForLocNetworkFilter()
    }
  }

  onLocNetworkDeSelectAll(items: any) {
    this.clearMapForLocNetworkFilter()
  }

  clearMapForLocConnectorFilter() {
    this.coordsFromConnectorFilterFormSearchLoc = [];
    this.curStateOfConnectorFilterFromSearchLoc = [];
    this.stationsToBeMarked = []
    while (this.mapMarkers.length) {
      let x = this.mapMarkers.pop()!
      x.setMap(null);
    }
    //  this.sharedService.sendConnectorSelect(this.coordsFromConnectorFilterFormSearchLoc);

  }


  clearMapForLocNetworkFilter() {
    this.coordsFromNetworkFilterFormSearchLoc = [];
    this.curStateOfNetworkFilterFromSearchLoc = [];
    this.stationsToBeMarked = []
    while (this.mapMarkers.length) {
      let x = this.mapMarkers.pop()!
      x.setMap(null);
    }
    // this.sharedService.sendConnectorSelect(this.coordsFromNetworkFilterFormSearchLoc);

  }

  onLocNetworkSelect(item: any) {

    this.curStateOfNetworkFilterFromSearchLoc.push(item.item_text);
    let selectedNetworkUrl = this.locSearched.concat('&ev_network=');
    console.log(selectedNetworkUrl)

    for (let network of this.curStateOfNetworkFilterFromSearchLoc) {
      selectedNetworkUrl = selectedNetworkUrl.concat(network).concat(",");

    }

    this.getNearestLocationInfoService.getStationInfoFromSearchedLoc(selectedNetworkUrl).subscribe((info) => {
      this.response = info;

      this.response.fuel_stations.forEach((station: FuelStationInfo) => {

        /*console.log('Station Name:', station.station_name,
          '**Station network:', station.ev_network,
          '**Station connector type:', station.ev_connector_types,
          '**Latitude', station.latitude,
          '**Longitude', station.longitude, '\n');*/

        let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

        let statObj: StationObj = {
          stationId: station.id, stationLocCoord: coord, stationPhone: station.station_phone,
          stationName: station.station_name, stationAddress: station.street_address, stationCity: station.city,
          stationState: station.state, stationZip: station.zip, stationHrs: station.access_days_time,
          stationPricing: station.ev_pricing, stationRenewableSource: station.ev_renewable_source,
          stationDCNum: station.ev_dc_fast_num, stationL1Num: station.ev_level1_evse_num,
          stationL2Num: station.ev_level2_evse_num, color: ""
        };
        statObj.color = this.setMarkerIcon(statObj)
        this.coordsFromNetworkFilterFormSearchLoc.push(statObj);
      })
      this.stationsToBeMarked = this.coordsFromNetworkFilterFormSearchLoc
      this.setMarkers()
    }
    );
  }

  onLocConnectorDeSelect(item: any) {

    let deSelectConnectorUrl = '&ev_connector_type='.concat(item.item_text);
    deSelectConnectorUrl = this.locSearched.concat(deSelectConnectorUrl);
    console.log(deSelectConnectorUrl)

    this.curStateOfConnectorFilterFromSearchLoc = this.curStateOfConnectorFilterFromSearchLoc.filter(e => e !== item.item_text)

    if (!(this.curStateOfConnectorFilterFromSearchLoc.length == 0)) {

      console.log('String to be passed:Getting the coords to be removed ' + deSelectConnectorUrl);

      this.getNearestLocationInfoService.getStationInfoFromSearchedLoc(deSelectConnectorUrl).subscribe((info) => {
        this.response = info;

        this.response.fuel_stations.forEach((station: FuelStationInfo) => {

          console.log('Station Name:', station.station_name,
            '**Station network:', station.ev_network,
            '**Station connector type:', station.ev_connector_types,
            '**Latitude', station.latitude,
            '**Longitude', station.longitude, '\n');

          let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

          console.log('Cood to be eliminated ');
          console.log(coord)

          let i = -1;
          this.coordsFromConnectorFilterFormSearchLoc.forEach(ord => {

            i++;
            if (ord.stationLocCoord.lat == coord.lat && ord.stationLocCoord.lng == coord.lng) {
              console.log(ord);
              this.coordsFromConnectorFilterFormSearchLoc.splice(i, 1);
            }

          });
          console.log('Final list after removal');
          console.log(this.coordsFromConnectorFilterFormSearchLoc)
        }
        )
        this.stationsToBeMarked = this.coordsFromConnectorFilterFormSearchLoc;
        this.setMarkers();
      });
      // this.sharedService.sendConnectorSelect(this.coordsFromConnectorFilterFormSearchLoc);

    }
    else {
      this.clearMapForLocConnectorFilter()
    }
  }

  onLocConnectorDeSelectAll(items: any) {
    this.clearMapForLocConnectorFilter()
  }

  onLocNetworkSelectAll(items: any) {

    let allNetworkUrl = '&ev_connector_type=all';
    allNetworkUrl = this.locSearched.concat(allNetworkUrl);
    console.log(allNetworkUrl)

    this.getNearestLocationInfoService.getStationInfoFromSearchedLoc(allNetworkUrl).subscribe((info) => {
      this.response = info;

      this.response.fuel_stations.forEach((station: FuelStationInfo) => {

        /* console.log('Station Name:', station.station_name,
           '**Station network:', station.ev_network,
           '**Station connector type:', station.ev_connector_types,
           '**Latitude', station.latitude,
           '**Longitude', station.longitude, '\n');*/

        let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

        let statObj: StationObj = {
          stationId: station.id, stationLocCoord: coord, stationPhone: station.station_phone,
          stationName: station.station_name, stationAddress: station.street_address, stationCity: station.city,
          stationState: station.state, stationZip: station.zip, stationHrs: station.access_days_time,
          stationPricing: station.ev_pricing, stationRenewableSource: station.ev_renewable_source,
          stationDCNum: station.ev_dc_fast_num, stationL1Num: station.ev_level1_evse_num,
          stationL2Num: station.ev_level2_evse_num, color: ""
        }
        statObj.color = this.setMarkerIcon(statObj)
        this.coordsFromNetworkFilterFormSearchLoc.push(statObj);
      }
      );
      console.log(this.coordsFromNetworkFilterFormSearchLoc);
      this.stationsToBeMarked = this.coordsFromNetworkFilterFormSearchLoc
      this.setMarkers()
    }
    );
    console.log(items);
  }
  // All stations Logic
  onNetworkSelect(item: any) {

    let selectedNetworkUrl = '&ev_network='.concat(item.item_text);
    this.curStateOfNetworkFilter.push(item.item_text);

    this.getInfoFromDropDownService.getStationInfoFromDropDown(selectedNetworkUrl).subscribe((info) => {
      this.responseForAllStations = info;

      this.responseForAllStations.fuel_stations.forEach((station: FuelStationInfo) => {
        console.log('Station Name:', station.station_name,
          '**Station network:', station.ev_network,
          '**Station connector type:', station.ev_connector_types,
          '**Latitude', station.latitude,
          '**Longitude', station.longitude, '\n');

        let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

        let statObj: StationObj = {
          stationId: station.id, stationLocCoord: coord, stationPhone: station.station_phone,
          stationName: station.station_name, stationAddress: station.street_address, stationCity: station.city,
          stationState: station.state, stationZip: station.zip, stationHrs: station.access_days_time,
          stationPricing: station.ev_pricing, stationRenewableSource: station.ev_renewable_source,
          stationDCNum: station.ev_dc_fast_num, stationL1Num: station.ev_level1_evse_num,
          stationL2Num: station.ev_level2_evse_num, color: ""
        };
        statObj.color = this.setMarkerIcon(statObj);
        this.coordsFromNetworkFilterForMaps.push(statObj);
      }
      );
      console.log(this.coordsFromNetworkFilterForMaps);
      this.stationsToBeMarked = this.coordsFromNetworkFilterForMaps;
      this.setMarkers()
    }
    );

  }
  //commenting car icons
  /*  setMarkerIcon(statObj: StationObj): string {
  
      if (statObj.stationL2Num != null) statObj.color = 'http://maps.google.com/mapfiles/kml/pal4/icon7.png' //red
      else if (statObj.stationL1Num != null) statObj.color = 'http://maps.google.com/mapfiles/kml/pal4/icon54.png' //green
      else if (statObj.stationDCNum != null) statObj.color = 'http://maps.google.com/mapfiles/kml/pal4/icon23.png' //yellow
      else statObj.color = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'
  
      return statObj.color;
    }*/
  setMarkerIcon(statObj: StationObj): string {

    if (statObj.stationL2Num != null) statObj.color = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    else if (statObj.stationL1Num != null) statObj.color = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    else if (statObj.stationDCNum != null) statObj.color = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    else statObj.color = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'

    return statObj.color;
  }
  onNetworkSelectAll(items: any) {

    let allNetworkurl = '&ev_network=all';

    this.getInfoFromDropDownService.getStationInfoFromDropDown(allNetworkurl).subscribe((info) => {
      this.responseForAllStations = info;

      this.responseForAllStations.fuel_stations.forEach((station: FuelStationInfo) => {
        console.log('Station Name:', station.station_name,
          '**Station network:', station.ev_network,
          '**Station connector type:', station.ev_connector_types,
          '**Latitude', station.latitude,
          '**Longitude', station.longitude, '\n');

        let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

        let statObj: StationObj = {
          stationId: station.id, stationLocCoord: coord, stationPhone: station.station_phone,
          stationName: station.station_name, stationAddress: station.street_address, stationCity: station.city,
          stationState: station.state, stationZip: station.zip, stationHrs: station.access_days_time,
          stationPricing: station.ev_pricing, stationRenewableSource: station.ev_renewable_source,
          stationDCNum: station.ev_dc_fast_num, stationL1Num: station.ev_level1_evse_num,
          stationL2Num: station.ev_level2_evse_num, color: ""
        }
        statObj.color = this.setMarkerIcon(statObj);
        this.coordsFromNetworkFilterForMaps.push(statObj);
      }
      )
      console.log(this.coordsFromNetworkFilterForMaps);
      this.stationsToBeMarked = this.coordsFromNetworkFilterForMaps;
      this.setMarkers()
    });

    console.log(items);
  }

  onNetworkDeSelect(item: any) {

    let deSelectNetworkUrl = '&ev_network='.concat(item.item_text);
    this.curStateOfNetworkFilter = this.curStateOfNetworkFilter.filter(e => e !== item.item_text)

    if (!(this.curStateOfNetworkFilter.length == 0)) {

      console.log('String to be passed:Getting the coords to be removed ' + deSelectNetworkUrl);

      this.getInfoFromDropDownService.getStationInfoFromDropDown(deSelectNetworkUrl).subscribe((info) => {
        this.responseForAllStations = info;

        this.responseForAllStations.fuel_stations.forEach((station: FuelStationInfo) => {

          console.log('Station Name:', station.station_name,
            '**Station network:', station.ev_network,
            '**Station connector type:', station.ev_connector_types,
            '**Latitude', station.latitude,
            '**Longitude', station.longitude, '\n');

          let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

          console.log('Cood to be eliminated ');
          console.log(coord)

          let i = -1;
          this.coordsFromNetworkFilterForMaps.forEach(ord => {

            i++;
            if (ord.stationLocCoord.lat == coord.lat && ord.stationLocCoord.lng == coord.lng) {
              console.log(ord);
              this.coordsFromNetworkFilterForMaps.splice(i, 1);
            }

          });

          console.log('Final list after removal');
          console.log(this.coordsFromNetworkFilterForMaps)
          this.stationsToBeMarked = this.coordsFromNetworkFilterForMaps;
          this.setMarkers()
        }
        )
      });

    }

    else {
      this.clearMapForNetworkFilter()
    }

  }

  onNetworkDeSelectAll(items: any) {
    this.clearMapForNetworkFilter()
  }

  clearMapForNetworkFilter() {
    this.coordsFromNetworkFilterForMaps = [];
    this.curStateOfNetworkFilter = [];
    this.stationsToBeMarked = []
    while (this.mapMarkers.length) {
      let x = this.mapMarkers.pop()!
      x.setMap(null);
    }
  }

  onConnectorSelect(item: any) {

    let selectedConnectorUrl = '&ev_connector_type='.concat(item.item_text);
    this.curStateOfConnectorFilter.push(item.item_text);

    this.getInfoFromDropDownService.getStationInfoFromDropDown(selectedConnectorUrl).subscribe((info) => {
      this.responseForAllStations = info;

      this.responseForAllStations.fuel_stations.forEach((station: FuelStationInfo) => {

        console.log('Station Name:', station.station_name,
          '**Station network:', station.ev_network,
          '**Station connector type:', station.ev_connector_types,
          '**Latitude', station.latitude,
          '**Longitude', station.longitude, '\n');

        let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

        let statObj: StationObj = {
          stationId: station.id, stationLocCoord: coord, stationPhone: station.station_phone,
          stationName: station.station_name, stationAddress: station.street_address, stationCity: station.city,
          stationState: station.state, stationZip: station.zip, stationHrs: station.access_days_time,
          stationPricing: station.ev_pricing, stationRenewableSource: station.ev_renewable_source,
          stationDCNum: station.ev_dc_fast_num, stationL1Num: station.ev_level1_evse_num,
          stationL2Num: station.ev_level2_evse_num, color: ""
        };
        statObj.color = this.setMarkerIcon(statObj)
        this.coordsFromConnectorFilterForMaps.push(statObj);
        console.log(this.coordsFromConnectorFilterForMaps);
        this.stationsToBeMarked = this.coordsFromConnectorFilterForMaps
        this.setMarkers()
      })
    }
    );


  }

  onConnectorSelectAll(items: any) {

    let allConnectorUrl = '&ev_connector_type=all';

    this.getInfoFromDropDownService.getStationInfoFromDropDown(allConnectorUrl).subscribe((info) => {
      this.responseForAllStations = info;

      this.responseForAllStations.fuel_stations.forEach((station: FuelStationInfo) => {

        console.log('Station Name:', station.station_name,
          '**Station network:', station.ev_network,
          '**Station connector type:', station.ev_connector_types,
          '**Latitude', station.latitude,
          '**Longitude', station.longitude, '\n');

        let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

        let statObj: StationObj = {
          stationId: station.id, stationLocCoord: coord, stationPhone: station.station_phone,
          stationName: station.station_name, stationAddress: station.street_address, stationCity: station.city,
          stationState: station.state, stationZip: station.zip, stationHrs: station.access_days_time,
          stationPricing: station.ev_pricing, stationRenewableSource: station.ev_renewable_source,
          stationDCNum: station.ev_dc_fast_num, stationL1Num: station.ev_level1_evse_num,
          stationL2Num: station.ev_level2_evse_num, color: ""
        }
        statObj.color = this.setMarkerIcon(statObj)
        this.coordsFromConnectorFilterForMaps.push(statObj);
      }
      );
      console.log(this.coordsFromConnectorFilterForMaps);
      this.stationsToBeMarked = this.coordsFromConnectorFilterForMaps
      this.setMarkers()
    });
    console.log(items);

  }

  onConnectorDeSelect(item: any) {

    let deSelectConnectorUrl = '&ev_connector_type='.concat(item.item_text);
    this.curStateOfConnectorFilter = this.curStateOfConnectorFilter.filter(e => e !== item.item_text)

    if (!(this.curStateOfConnectorFilter.length == 0)) {

      console.log('String to be passed:Getting the coords to be removed ' + deSelectConnectorUrl);

      this.getInfoFromDropDownService.getStationInfoFromDropDown(deSelectConnectorUrl).subscribe((info) => {
        this.responseForAllStations = info;

        this.responseForAllStations.fuel_stations.forEach((station: FuelStationInfo) => {

          console.log('Station Name:', station.station_name,
            '**Station network:', station.ev_network,
            '**Station connector type:', station.ev_connector_types,
            '**Latitude', station.latitude,
            '**Longitude', station.longitude, '\n');

          let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

          console.log('Cood to be eliminated ');
          console.log(coord)

          let i = -1;
          this.coordsFromConnectorFilterForMaps.forEach(ord => {

            i++;
            if (ord.stationLocCoord.lat == coord.lat && ord.stationLocCoord.lng == coord.lng) {
              console.log(ord);
              this.coordsFromConnectorFilterForMaps.splice(i, 1);
            }

          });
          console.log('Final list after removal');
          console.log(this.coordsFromConnectorFilterForMaps)
        }
        )
        this.stationsToBeMarked = this.coordsFromConnectorFilterForMaps;
        this.setMarkers()
      });
      
    }
    else {
      this.clearMapForConnectorFilter()
    }
  }

  clearMapForConnectorFilter() {
    this.coordsFromConnectorFilterForMaps = [];
    this.curStateOfConnectorFilter = [];
    this.stationsToBeMarked = []
    while (this.mapMarkers.length) {
      let x = this.mapMarkers.pop()!
      x.setMap(null);
    }
  }

  onConnectorDeSelectAll(items: any) {
    this.clearMapForConnectorFilter()
  }

  onLevelSelect(item: any) {

    let selectLevelUrl = '&ev_charging_level=';

    switch (item.item_text) {

      case 'Level 1':
        selectLevelUrl = selectLevelUrl.concat('1');
        this.curStateOfLevelFilter.push('1')
        break;

      case 'Level 2':
        selectLevelUrl = selectLevelUrl.concat('2');
        this.curStateOfLevelFilter.push('2')
        break;

      case 'DC Fast':
        selectLevelUrl = selectLevelUrl.concat('dc_fast');
        this.curStateOfLevelFilter.push('3')
        break;

      case 'Legacy Chargers':
        selectLevelUrl = selectLevelUrl.concat('legacy');
        this.curStateOfLevelFilter.push('legacy')
        break;

      default:
        selectLevelUrl = '';
    }

    this.getInfoFromDropDownService.getStationInfoFromDropDown(selectLevelUrl).subscribe((info) => {
      this.responseForAllStations = info;

      this.responseForAllStations.fuel_stations.forEach((station: FuelStationInfo) => {

        console.log('Station Name:', station.station_name,
          '**Station network:', station.ev_network,
          '**Station connector type:', station.ev_connector_types,
          '**Latitude', station.latitude,
          '**Longitude', station.longitude, '\n');

        let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

        let statObj: StationObj = {
          stationId: station.id, stationLocCoord: coord, stationPhone: station.station_phone,
          stationName: station.station_name, stationAddress: station.street_address, stationCity: station.city,
          stationState: station.state, stationZip: station.zip, stationHrs: station.access_days_time,
          stationPricing: station.ev_pricing, stationRenewableSource: station.ev_renewable_source,
          stationDCNum: station.ev_dc_fast_num, stationL1Num: station.ev_level1_evse_num,
          stationL2Num: station.ev_level2_evse_num, color: ""
        };
        statObj.color = this.setMarkerIcon(statObj)
        this.coordsFromLevelFilterForMaps.push(statObj);
      })
      console.log(this.coordsFromLevelFilterForMaps);
      this.stationsToBeMarked = this.coordsFromLevelFilterForMaps
      this.setMarkers()
    });    
  }

  onLevelDeSelect(item: any) {
    //  console.log('In deslect: ' + item.item_text)
    //  console.log('Before switch exec: ' + this.curStateOfLevelFilter);
    console.log('hereeee')
    let deSelectLevelUrl = '&ev_charging_level=';

    switch (item.item_text) {

      case 'Level 1':
        deSelectLevelUrl = deSelectLevelUrl.concat('1');
        this.curStateOfLevelFilter = this.curStateOfLevelFilter.filter(e => e !== '1');
        break;

      case 'Level 2':
        deSelectLevelUrl = deSelectLevelUrl.concat('2');
        this.curStateOfLevelFilter = this.curStateOfLevelFilter.filter(e => e !== '2');
        break;

      case 'DC Fast':
        deSelectLevelUrl = deSelectLevelUrl.concat('dc_fast');
        this.curStateOfLevelFilter = this.curStateOfLevelFilter.filter(e => e !== 'dc_fast');
        break;

      case 'Legacy Chargers':
        deSelectLevelUrl = deSelectLevelUrl.concat('legacy');
        this.curStateOfLevelFilter = this.curStateOfLevelFilter.filter(e => e !== 'legacy');
        break;
    }

    //  console.log('After switch exec: ' + this.curStateOfLevelFilter);
    if (!(this.curStateOfLevelFilter.length == 0)) {

      console.log('String to be passed:Getting the coords to be removed ' + deSelectLevelUrl);
      this.getInfoFromDropDownService.getStationInfoFromDropDown(deSelectLevelUrl).subscribe((info) => {
        this.responseForAllStations = info;

        this.responseForAllStations.fuel_stations.forEach((station: FuelStationInfo) => {

          console.log('Station Name:', station.station_name,
            '**Station network:', station.ev_network,
            '**Station connector type:', station.ev_connector_types,
            '**Latitude', station.latitude,
            '**Longitude', station.longitude, '\n');

          let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

          console.log('Cood to be eliminated ');
          console.log(coord)

          let i = -1;
          this.coordsFromLevelFilterForMaps.forEach(ord => {

            i++;
            if (ord.stationLocCoord.lat == coord.lat && ord.stationLocCoord.lng == coord.lng) {
              console.log(ord);
              this.coordsFromLevelFilterForMaps.splice(i, 1);
            }

          });
          console.log('Final list after removal');
          console.log(this.coordsFromLevelFilterForMaps)
        }
        )
        this.stationsToBeMarked = this.coordsFromLevelFilterForMaps
        this.setMarkers()
      });
    }
    else {
      this.clearMapForLevelFilter()
    }
  }

  onLevelDeSelectAll(items: any) {
    this.clearMapForLevelFilter();
  }

  clearMapForLevelFilter() {
    this.coordsFromLevelFilterForMaps = [];
    this.curStateOfLevelFilter = [];
    this.stationsToBeMarked = []
    while (this.mapMarkers.length) {
      let x = this.mapMarkers.pop()!
      x.setMap(null);
    }
  }

  onLevelSelectAll(items: any) {
    let allLevelurl = '&ev_charging_level=all';

    this.getInfoFromDropDownService.getStationInfoFromDropDown(allLevelurl).subscribe((info) => {
      this.responseForAllStations = info;

      this.responseForAllStations.fuel_stations.forEach((station: FuelStationInfo) => {

        console.log('Station Name:', station.station_name,
          '**Station network:', station.ev_network,
          '**Station connector type:', station.ev_connector_types,
          '**Latitude', station.latitude,
          '**Longitude', station.longitude, '\n');

        let coord: Coordinate = { lat: station.latitude, lng: station.longitude };

        let statObj: StationObj = {
          stationId: station.id, stationLocCoord: coord, stationPhone: station.station_phone,
          stationName: station.station_name, stationAddress: station.street_address, stationCity: station.city,
          stationState: station.state, stationZip: station.zip, stationHrs: station.access_days_time,
          stationPricing: station.ev_pricing, stationRenewableSource: station.ev_renewable_source,
          stationDCNum: station.ev_dc_fast_num, stationL1Num: station.ev_level1_evse_num,
          stationL2Num: station.ev_level2_evse_num, color: ""
        }
        statObj.color = this.setMarkerIcon(statObj)
        this.coordsFromLevelFilterForMaps.push(statObj);
      }
      );
      console.log(this.coordsFromLevelFilterForMaps);
      this.stationsToBeMarked = this.coordsFromLevelFilterForMaps
      this.setMarkers()
    }
    );
    console.log(items);
  }

}
