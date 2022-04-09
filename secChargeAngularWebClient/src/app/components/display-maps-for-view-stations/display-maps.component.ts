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
      this.levelDataRefresh(value);
    });
    console.log('LevelFilter:')
    console.log(this.levelFileterStations);

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
    this.levelFileterStations = value;
    this.stationsToBeMarked = this.levelFileterStations;
  }



  ngOnDestroy() {

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
  onNetworkDeSelect(item: any) {

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
      });
      this.sharedService.sendConnectorSelect(this.coordsFromNetworkFilterFormSearchLoc);
    }
    else {
      this.clearMapForNetworkFilter()
    }
  }

  onNetworkDeSelectAll(items: any) {
    this.clearMapForNetworkFilter()
  }

  clearMapForConnectorFilter() {
    this.coordsFromConnectorFilterFormSearchLoc = [];
    this.curStateOfConnectorFilterFromSearchLoc = [];
    this.sharedService.sendConnectorSelect(this.coordsFromConnectorFilterFormSearchLoc);

  }


  clearMapForNetworkFilter() {
    this.coordsFromNetworkFilterFormSearchLoc = [];
    this.curStateOfNetworkFilterFromSearchLoc = [];
    this.sharedService.sendConnectorSelect(this.coordsFromNetworkFilterFormSearchLoc);

  }

  setMarkerIcon(statObj: StationObj): string {

    if (statObj.stationL2Num != null) statObj.color = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    else if (statObj.stationL1Num != null) statObj.color = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    else if (statObj.stationDCNum != null) statObj.color = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    else statObj.color = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'

    return statObj.color;
  }

  onNetworkSelect(item: any) {
  
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
    }
    );
    console.log(this.coordsFromNetworkFilterFormSearchLoc);
    this.stationsToBeMarked = this.coordsFromNetworkFilterFormSearchLoc;
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

  onNetworkSelectAll(items: any) {

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
    }
    );
    console.log(items);
  }



}
