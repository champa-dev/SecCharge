import { Injectable } from '@angular/core';
import { FuelStationInfo, Response } from '../Response';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetInfoFromDropDownService {
  private staticApiUrl = 'https://developer.nrel.gov/api/alt-fuel-stations/v1.json?fuel_type=ELEC&api_key=xyHBoB7uGoJZVghcZ3y13Zkaoi3mMMMeehPcPUC4&country=CA&state=ON,QC&limit=all';
  
  constructor(private http: HttpClient) { }

  getStationInfoFromDropDown(customUrlPart: string): Observable<Response> {
    let url = this.staticApiUrl.concat(customUrlPart);
    return this.http.get<Response>(url);
  }
}
