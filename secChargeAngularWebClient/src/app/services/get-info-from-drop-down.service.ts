import { Injectable } from '@angular/core';
import { FuelStationInfo, Response } from '../Response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetInfoFromDropDownService {
  private staticApiUrl = 'https://developer.nrel.gov/api/alt-fuel-stations/v1.json?fuel_type=ELEC&api_key=xyHBoB7uGoJZVghcZ3y13Zkaoi3mMMMeehPcPUC4&country=CA&state=ON,QC&limit=200';
  
  constructor(private http: HttpClient) { }

  getStationInfoFromDropDown(customUrlPart: string): Observable<Response> {
    console.log('in HTTPservice')
    let url = this.staticApiUrl.concat(customUrlPart);
    console.log(url)
    return this.http.get<Response>(url);
  }
}
