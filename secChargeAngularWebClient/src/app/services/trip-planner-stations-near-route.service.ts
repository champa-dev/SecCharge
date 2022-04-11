import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NearByRouteResponse } from '../NearByRouteResponse';

@Injectable({
  providedIn: 'root'
})
export class TripPlannerStationsNearRouteService {

  private staticApiUrl = 'https://developer.nrel.gov/api/alt-fuel-stations/v1/nearby-route.json?api_key=xyHBoB7uGoJZVghcZ3y13Zkaoi3mMMMeehPcPUC4&country=CA&limit=all';


  constructor(private http: HttpClient) { }

  getStationInfoForRoutes(customUrlPart: string): Observable<NearByRouteResponse> {
    let url = this.staticApiUrl.concat(customUrlPart);
    console.log(url)
    return this.http.get<NearByRouteResponse>(url);
  }
}

