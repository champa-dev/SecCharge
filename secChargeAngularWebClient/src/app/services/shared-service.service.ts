import { StationObj } from './../Station';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Coordinate } from '../Coordinate';


@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private levelSubject = new Subject<StationObj[]>();
  levelData: StationObj[] = [];

  private ConnectorSubject = new Subject<StationObj[]>();
  connectorData: StationObj[] = [];

  private networkSubject = new Subject<StationObj[]>();
  networkData: StationObj[] = [];

  constructor() { }
  sendLevelSelect(dataFromSender: StationObj[]) {
    this.levelData = dataFromSender;
    dataFromSender.forEach(ele=>console.log(ele))
    this.levelSubject.next(this.levelData);
  }

  getLevelSelectEvent(): Observable<StationObj[]> {
    return this.levelSubject.asObservable();
  }

  sendConnectorSelect(dataFromSender: StationObj[]) {
    this.connectorData = dataFromSender;
    this.ConnectorSubject.next(this.connectorData);
  }

  getConnectorSelectEvent(): Observable<StationObj[]> {
    return this.ConnectorSubject.asObservable();
  }

  sendNetworkSelect(dataFromSender: StationObj[]) {
    this.networkData = dataFromSender;
    this.networkSubject.next(this.networkData);
  }

  getNetworkSelectEvent(): Observable<StationObj[]> {
    return this.networkSubject.asObservable();
  }

}
