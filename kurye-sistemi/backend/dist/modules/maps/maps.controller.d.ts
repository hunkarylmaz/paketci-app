import { MapsService } from './maps.service';
interface Coordinates {
    lat: number;
    lng: number;
}
export declare class MapsController {
    private readonly mapsService;
    constructor(mapsService: MapsService);
    calculateRoute(body: {
        origin: Coordinates;
        destination: Coordinates;
        waypoints?: Coordinates[];
    }): Promise<any>;
    calculateOptimizedRoute(body: {
        waypoints: Coordinates[];
    }): Promise<any>;
    geocodeAddress(address: string): Promise<any>;
    reverseGeocode(lat: string, lng: string): Promise<any>;
    getTileServers(): {
        servers: Record<string, string>;
        attribution: string;
    };
    calculateDistanceMatrix(body: {
        origins: Coordinates[];
        destinations: Coordinates[];
    }): Promise<number[][]>;
    decodePolyline(body: {
        encoded: string;
    }): any;
}
export {};
