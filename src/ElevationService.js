/* global google */
import {isNumber} from './utils';
export default class ElevationService 
{
    /*
    Quotas
    2,500 free requests per day, calculated as the sum of client-side and server-side queries; 
    enable billing to access higher daily quotas, billed at $0.50 USD / 1000 additional requests, up to 100,000 requests daily.
    512 locations per request.
    50 requests per second*, calculated as the sum of client-side and server-side queries combined.
    */
    constructor() 
    {
        this.elevator = new google.maps.ElevationService();
    }
    getElevationForBounds(gBounds) 
    {
        // Map Coords.
        const sw = gBounds.getSouthWest();
        const ne = gBounds.getNorthEast();
        const n  = ne.lat();   
        const e  = ne.lng();
        const s  = sw.lat();   
        const w  = sw.lng();

        // Create evenly spread points grid.
        const quotaLimit = 512;
        const noPointsAlongSide = Math.floor(Math.sqrt(quotaLimit));
        const incrLat = (n - s) / (noPointsAlongSide - 1);
        const incrLng = (e - w) / (noPointsAlongSide - 1);
        const arrLatLng = [];

        let lat, lng;
        for (let i = 0; i < noPointsAlongSide; i++) 
        {
            lat = n - (incrLat * i);
            for (let j = 0; j < noPointsAlongSide; j++) 
            {
                lng = w + (incrLng * j);
                if (isNumber(lat) && isNumber(lng)) arrLatLng.push(new google.maps.LatLng(lat, lng));
            }
        }

        return new Promise((resolve, reject) => 
        {
            this.elevator.getElevationForLocations(
            {
                'locations': arrLatLng
            }, 
            (results, status) =>
            {
                if (status === 'OK') 
                {
                    if (results[0]) resolve(results);
                    else reject('No results found');
                } 
                else reject(status);
            })
        })
    }
}