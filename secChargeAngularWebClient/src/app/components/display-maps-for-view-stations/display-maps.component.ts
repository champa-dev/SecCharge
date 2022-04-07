import { StationObj } from 'src/app/Station';
import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { GoogleMapsModule, MapGeocoder } from '@angular/google-maps'
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { SharedService } from 'src/app/services/shared-service.service';
import { Subscription } from 'rxjs'
import { Coordinate } from 'src/app/Coordinate';
import { ChangeDetectionStrategy } from '@angular/compiler';
import { GetLocationBasedStationInfoService } from 'src/app/services/get-location-based-station-info.service';
import { Response, FuelStationInfo } from 'src/app/Response';
import { NearestStationResponse } from 'src/app/NearestStationResponse';
import { IDropdownSettings } from 'ng-multiselect-dropdown';


@Component({
  selector: 'app-display-maps',
  templateUrl: './display-maps.component.html',
  styleUrls: ['./display-maps.component.css'],

})
export class DisplayMapsComponent implements OnInit {

  showMsg = false;
  response!: NearestStationResponse;

  coordsFromNearestStationService: StationObj[] = [];
  markerIcon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  //"{icon:{url:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}}"
  levelSelectEventSubscription!: Subscription;
  connectorSelectEventSubscription!: Subscription;
  networkSelectEventSubscription!: Subscription;

  levelsFilterStations: StationObj[] = [];
  connectorFilterStations: StationObj[] = [];
  networkFilterStations: StationObj[] = [];

  coordsFromConnectorFilterFormSearchLoc: StationObj[] = [];
  curStateOfConnectorFilterFromSearchLoc: string[] = [];

  curStateOfLevelFilterFromSearchLoc: string[] = [];
  coordsFromLevelFilterFormSearchLoc: StationObj[] = [];

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

  stationsToBeMarked: StationObj[] = [];
  locSearched: string = ""


  @ViewChild(GoogleMap) map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;
  @ViewChild('mapSearchBox') searchField!: ElementRef;
  @ViewChild(MapGeocoder) geocoder!: MapGeocoder;

  mapOptions: google.maps.MapOptions = {
    center: { lat: 45, lng: -75 }, //ottawa
    zoom: 6
  }

  infoWindowContent: StationObj = {
    stationId: 1,
    stationLocCoord: { lat: 45, lng: -75 },
    stationPhone: "",
    stationName: "",
    stationAddress: "",
    stationCity: "",
    stationState: "",
    stationZip: "",
    stationHrs: "",
    stationPricing: "",
    stationRenewableSource: "",
    stationDCNum: 1,
    stationL1Num: 1,
    stationL2Num: 1,
    color: ""
  };

  constructor(private sharedService: SharedService, private getNearestLocationInfoService: GetLocationBasedStationInfoService) {

    this.levelSelectEventSubscription = this.sharedService.getLevelSelectEvent().subscribe((value: StationObj[]) => {
      value.forEach(ele => console.log(ele))
      this.levelDataRefresh(value);
    });
    console.log('LevelFilter:')
    console.log(this.levelsFilterStations);

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
  }

  levelDataRefresh(value: StationObj[]) {

    this.levelsFilterStations = value;
    this.stationsToBeMarked = this.levelsFilterStations;
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



  ngOnDestroy() {
    this.levelSelectEventSubscription.unsubscribe();
    this.connectorSelectEventSubscription.unsubscribe();
    this.networkSelectEventSubscription.unsubscribe();
  }

  openInfoWindow(marker: MapMarker, curStation: StationObj) {
    this.infoWindowContent.stationName = curStation.stationName
    this.infoWindowContent.stationPhone = curStation.stationPhone
    this.infoWindowContent.stationAddress = curStation.stationAddress
    this.infoWindowContent.stationCity = curStation.stationCity
    this.infoWindowContent.stationState = curStation.stationState
    this.infoWindowContent.stationZip = curStation.stationZip
    this.infoWindowContent.stationHrs = curStation.stationHrs
    this.infoWindowContent.stationPricing = curStation.stationPricing
    this.infoWindowContent.stationRenewableSource = curStation.stationRenewableSource
    this.infoWindow.open(marker);

  }

  ngAfterViewInit(): void {
    const searchBox = new google.maps.places.SearchBox(this.searchField.nativeElement,);
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.searchField.nativeElement,);

    searchBox.addListener('places_changed', () => {
      const places = searchBox.getPlaces();
      if (places?.length === 0) {
        return;
      }
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
      this.map.fitBounds(bounds)
    })
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
      //  console.log(this.stationsToBeMarked)
      //  console.log(x)
    });

  }

  onConnectorSelect(item: any) {
  
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
    }
    );
    console.log(this.coordsFromConnectorFilterFormSearchLoc);
    this.stationsToBeMarked = this.coordsFromConnectorFilterFormSearchLoc;
  }

  onConnectorSelectAll(items: any) {

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
    }
    );
    console.log(items);
  }
  onConnectorDeSelect(item: any) {

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
      });
      this.sharedService.sendConnectorSelect(this.coordsFromConnectorFilterFormSearchLoc);
    }
    else {
      this.clearMapForConnectorFilter()
    }
  }

  onConnectorDeSelectAll(items: any) {
    this.clearMapForConnectorFilter()
  }

  clearMapForConnectorFilter() {
    this.coordsFromConnectorFilterFormSearchLoc = [];
    this.curStateOfConnectorFilterFromSearchLoc = [];
    this.sharedService.sendConnectorSelect(this.coordsFromConnectorFilterFormSearchLoc);

  }


  onLevelSelect(item: any) {
    let selectLevelUrl = '&ev_charging_level=';

    switch (item.item_text) {

      case 'Level 1':
        selectLevelUrl = selectLevelUrl.concat('1');
        this.curStateOfLevelFilterFromSearchLoc.push('1')
        break;

      case 'Level 2':
        selectLevelUrl = selectLevelUrl.concat('2');
        this.curStateOfLevelFilterFromSearchLoc.push('2')
        break;

      case 'DC Fast':
        selectLevelUrl = selectLevelUrl.concat('dc_fast');
        this.curStateOfLevelFilterFromSearchLoc.push('3')
        break;

      case 'Legacy Chargers':
        selectLevelUrl = selectLevelUrl.concat('legacy');
        this.curStateOfLevelFilterFromSearchLoc.push('legacy')
        break;

      default:
        selectLevelUrl = '';
    }

    selectLevelUrl = this.locSearched.concat(selectLevelUrl);
    console.log(selectLevelUrl)

    this.getNearestLocationInfoService.getStationInfoFromSearchedLoc(selectLevelUrl).subscribe((info) => {
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
        };
        statObj.color = this.setMarkerIcon(statObj)
        this.coordsFromLevelFilterFormSearchLoc.push(statObj);
      })
    });
    console.log(this.coordsFromLevelFilterFormSearchLoc);
    this.sharedService.sendLevelSelect(this.coordsFromLevelFilterFormSearchLoc);
  }
  setMarkerIcon(statObj: StationObj): string {

    if (statObj.stationL2Num != null) statObj.color = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    else if (statObj.stationL1Num != null) statObj.color = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    else if (statObj.stationDCNum != null) statObj.color = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    else statObj.color = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'

    return statObj.color;
  }
  onLevelSelectAll(items: any) {
    let allLevelurl = '&ev_charging_level=all';
    allLevelurl = this.locSearched.concat(allLevelurl);
    console.log(allLevelurl)

    this.getNearestLocationInfoService.getStationInfoFromSearchedLoc(allLevelurl).subscribe((info) => {
      this.response = info;

      this.response.fuel_stations.forEach((station: FuelStationInfo) => {

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
        this.coordsFromLevelFilterFormSearchLoc.push(statObj);
      }
      );
      console.log(this.coordsFromLevelFilterFormSearchLoc);
      this.sharedService.sendLevelSelect(this.coordsFromLevelFilterFormSearchLoc);
    }
    );
    console.log(items);
  }
  onLevelDeSelect(item: any) {
    //  console.log('In deslect: ' + item.item_text)
    //  console.log('Before switch exec: ' + this.curStateOfLevelFilter);
    console.log('hereeee')
    let deSelectLevelUrl = '&ev_charging_level=';

    switch (item.item_text) {

      case 'Level 1':
        deSelectLevelUrl = deSelectLevelUrl.concat('1');
        this.curStateOfLevelFilterFromSearchLoc = this.curStateOfLevelFilterFromSearchLoc.filter(e => e !== '1');
        break;

      case 'Level 2':
        deSelectLevelUrl = deSelectLevelUrl.concat('2');
        this.curStateOfLevelFilterFromSearchLoc = this.curStateOfLevelFilterFromSearchLoc.filter(e => e !== '2');
        break;

      case 'DC Fast':
        deSelectLevelUrl = deSelectLevelUrl.concat('dc_fast');
        this.curStateOfLevelFilterFromSearchLoc = this.curStateOfLevelFilterFromSearchLoc.filter(e => e !== 'dc_fast');
        break;

      case 'Legacy Chargers':
        deSelectLevelUrl = deSelectLevelUrl.concat('legacy');
        this.curStateOfLevelFilterFromSearchLoc = this.curStateOfLevelFilterFromSearchLoc.filter(e => e !== 'legacy');
        break;
    }

    deSelectLevelUrl = this.locSearched.concat(deSelectLevelUrl);
    console.log(deSelectLevelUrl)
    //  console.log('After switch exec: ' + this.curStateOfLevelFilter);
    if (!(this.curStateOfLevelFilterFromSearchLoc.length == 0)) {

      console.log('String to be passed:Getting the coords to be removed ' + deSelectLevelUrl);
      this.getNearestLocationInfoService.getStationInfoFromSearchedLoc(deSelectLevelUrl).subscribe((info) => {
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
          this.coordsFromLevelFilterFormSearchLoc.forEach(ord => {

            i++;
            if (ord.stationLocCoord.lat == coord.lat && ord.stationLocCoord.lng == coord.lng) {
              console.log(ord);
              this.coordsFromLevelFilterFormSearchLoc.splice(i, 1);
            }

          });
          console.log('Final list after removal');
          console.log(this.coordsFromLevelFilterFormSearchLoc)
        }
        )
      });
      this.sharedService.sendLevelSelect(this.coordsFromLevelFilterFormSearchLoc);
    }
    else {
      this.clearMapForLevelFilter()
    }
  }
  onLevelDeSelectAll(items: any) {
    this.clearMapForLevelFilter();
  }
  clearMapForLevelFilter() {
    this.coordsFromLevelFilterFormSearchLoc = [];
    this.curStateOfLevelFilterFromSearchLoc = [];
    this.sharedService.sendLevelSelect(this.coordsFromLevelFilterFormSearchLoc);
  }


}
