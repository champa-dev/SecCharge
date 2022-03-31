import { GetInfoFromDropDownService } from './../../services/get-info-from-drop-down.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FuelStationInfo, Response } from './../../Response'
import { SharedService } from 'src/app/services/shared-service.service';
import { DisplayMapsComponent } from '../display-maps/display-maps.component';
import { Coordinate } from 'src/app/Coordinate';
import { StationObj } from 'src/app/Station';



@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html',
  styleUrls: ['./drop-down.component.css']
})
export class DropDownComponent implements OnInit {

  /*  curStateOfLevelFilter is used for the scenario when the user deselects all the level filters 
  one by one instead of using 'Unselect All' button ...Same with the curStateOfConnectorFilter and 
  curStateOfNetworkFilter as well */

  coordsFromLevelFilterForMaps: StationObj[] = [];
  curStateOfLevelFilter: string[] = [];

  coordsFromConnectorFilterForMaps: StationObj[] = [];
  curStateOfConnectorFilter: string[] = [];

  coordsFromNetworkFilterForMaps: StationObj[] = [];
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

  response!: Response;

  constructor(private getInfoFromDropDownService: GetInfoFromDropDownService, private sharedService: SharedService) { }

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

  onNetworkSelect(item: any) {

    let selectedNetworkUrl = '&ev_network='.concat(item.item_text);
    this.curStateOfNetworkFilter.push(item.item_text);

    this.getInfoFromDropDownService.getStationInfoFromDropDown(selectedNetworkUrl).subscribe((info) => {
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
        };
        statObj.color = this.setMarkerIcon(statObj);
        this.coordsFromNetworkFilterForMaps.push(statObj);
      }
      );
      console.log(this.coordsFromNetworkFilterForMaps);
      this.sharedService.sendNetworkSelect(this.coordsFromNetworkFilterForMaps);
    }
    );

  }

  setMarkerIcon(statObj: StationObj): string {

    if (statObj.stationL2Num != null) statObj.color = 'http://maps.google.com/mapfiles/kml/pal4/icon7.png' //red
    else if (statObj.stationL1Num != null) statObj.color = 'http://maps.google.com/mapfiles/kml/pal4/icon54.png' //green
    else if (statObj.stationDCNum != null) statObj.color = 'http://maps.google.com/mapfiles/kml/pal4/icon23.png' //yellow
    else statObj.color = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png'

    return statObj.color;
  }
  onNetworkSelectAll(items: any) {

    let allNetworkurl = '&ev_network=all';

    this.getInfoFromDropDownService.getStationInfoFromDropDown(allNetworkurl).subscribe((info) => {
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
        statObj.color = this.setMarkerIcon(statObj);
        this.coordsFromNetworkFilterForMaps.push(statObj);
      }
      )
      console.log(this.coordsFromNetworkFilterForMaps);
      this.sharedService.sendNetworkSelect(this.coordsFromNetworkFilterForMaps);
    });

    console.log(items);
  }

  onNetworkDeSelect(item: any) {

    let deSelectNetworkUrl = '&ev_network='.concat(item.item_text);
    this.curStateOfNetworkFilter = this.curStateOfNetworkFilter.filter(e => e !== item.item_text)

    if (!(this.curStateOfNetworkFilter.length == 0)) {

      console.log('String to be passed:Getting the coords to be removed ' + deSelectNetworkUrl);

      this.getInfoFromDropDownService.getStationInfoFromDropDown(deSelectNetworkUrl).subscribe((info) => {
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
          this.coordsFromNetworkFilterForMaps.forEach(ord => {

            i++;
            if (ord.stationLocCoord.lat == coord.lat && ord.stationLocCoord.lng == coord.lng) {
              console.log(ord);
              this.coordsFromNetworkFilterForMaps.splice(i, 1);
            }

          });

          console.log('Final list after removal');
          console.log(this.coordsFromNetworkFilterForMaps)
        }
        )
      });
      this.sharedService.sendNetworkSelect(this.coordsFromNetworkFilterForMaps);
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
    this.sharedService.sendNetworkSelect(this.coordsFromNetworkFilterForMaps);
  }

  onConnectorSelect(item: any) {

    let selectedConnectorUrl = '&ev_connector_type='.concat(item.item_text);
    this.curStateOfConnectorFilter.push(item.item_text);

    this.getInfoFromDropDownService.getStationInfoFromDropDown(selectedConnectorUrl).subscribe((info) => {
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
        };
        statObj.color = this.setMarkerIcon(statObj)
        this.coordsFromConnectorFilterForMaps.push(statObj);

      })
    }
    );
    console.log(this.coordsFromConnectorFilterForMaps);
    this.sharedService.sendConnectorSelect(this.coordsFromConnectorFilterForMaps);
  }

  onConnectorSelectAll(items: any) {

    let allConnectorUrl = '&ev_connector_type=all';

    this.getInfoFromDropDownService.getStationInfoFromDropDown(allConnectorUrl).subscribe((info) => {
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
        this.coordsFromConnectorFilterForMaps.push(statObj);
      }
      );
      console.log(this.coordsFromConnectorFilterForMaps);
      this.sharedService.sendConnectorSelect(this.coordsFromConnectorFilterForMaps);
    });
    console.log(items);

  }

  onConnectorDeSelect(item: any) {

    let deSelectConnectorUrl = '&ev_connector_type='.concat(item.item_text);
    this.curStateOfConnectorFilter = this.curStateOfConnectorFilter.filter(e => e !== item.item_text)

    if (!(this.curStateOfConnectorFilter.length == 0)) {

      console.log('String to be passed:Getting the coords to be removed ' + deSelectConnectorUrl);

      this.getInfoFromDropDownService.getStationInfoFromDropDown(deSelectConnectorUrl).subscribe((info) => {
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
      });
      this.sharedService.sendConnectorSelect(this.coordsFromConnectorFilterForMaps);
    }
    else {
      this.clearMapForConnectorFilter()
    }
  }

  clearMapForConnectorFilter() {
    this.coordsFromConnectorFilterForMaps = [];
    this.curStateOfConnectorFilter = [];
    this.sharedService.sendConnectorSelect(this.coordsFromConnectorFilterForMaps);
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
        };
        statObj.color = this.setMarkerIcon(statObj)
        this.coordsFromLevelFilterForMaps.push(statObj);
      })
    });
    console.log(this.coordsFromLevelFilterForMaps);
    this.sharedService.sendLevelSelect(this.coordsFromLevelFilterForMaps);
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
      });
      this.sharedService.sendLevelSelect(this.coordsFromLevelFilterForMaps);
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
    this.sharedService.sendLevelSelect(this.coordsFromLevelFilterForMaps);
  }

  onLevelSelectAll(items: any) {
    let allLevelurl = '&ev_charging_level=all';

    this.getInfoFromDropDownService.getStationInfoFromDropDown(allLevelurl).subscribe((info) => {
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
        this.coordsFromLevelFilterForMaps.push(statObj);
      }
      );
      console.log(this.coordsFromLevelFilterForMaps);
      this.sharedService.sendLevelSelect(this.coordsFromLevelFilterForMaps);
    }
    );
    console.log(items);
  }
}

