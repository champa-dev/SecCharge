import { FuelStationInfo } from "./Response";

export interface NearByRouteResponse {
    total_results: number;
    station_counts: any[];
    station_locator_url: string;
    offset: number;
    latitude: number;
    longitude: number;
    precision: number;
    fuel_stations: FuelStationInfo[];
}