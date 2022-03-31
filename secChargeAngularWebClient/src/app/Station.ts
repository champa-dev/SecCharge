import { Coordinate } from "./Coordinate";
export interface StationObj{
    stationId : number;
    stationLocCoord : Coordinate;
    stationPhone: string;
    stationName: string;
    stationAddress: string;
    stationCity: string;
    stationState: string;
    stationZip: string;
    stationHrs: string;
    stationPricing: string;
    stationRenewableSource: string;
    stationDCNum: number;
    stationL1Num: number;
    stationL2Num: number
    color: string
}