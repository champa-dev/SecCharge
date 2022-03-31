import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Response, FuelStationInfo } from '../Response';
import { NearestStationResponse } from '../NearestStationResponse';

@Injectable({
  providedIn: 'root'
})
export class GetLocationBasedStationInfoService {

  private staticApiUrl = 'https://developer.nrel.gov/api/alt-fuel-stations/v1/nearest.json?country=CA&access=public&api_key=xyHBoB7uGoJZVghcZ3y13Zkaoi3mMMMeehPcPUC4&fuel_type=ELEC&limit=all';
 
  constructor(private http: HttpClient) { }

  getStationInfoFromSearchedLoc(customUrlPart: string): Observable<NearestStationResponse> {
    let url = this.staticApiUrl.concat(customUrlPart);
    console.log(url)
    return this.http.get<NearestStationResponse>(url);
  }
  
}
