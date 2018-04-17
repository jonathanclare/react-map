/* global google */
/* global kriging */
import Raster from './Raster';
import GoogleMercator from './GoogleMercator';
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
    getElevationForLocations(arrLatLng) 
    {
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
            });
        });
    }
    getElevationForBounds(gBounds, nPoints = 512) 
    {
        const quotaLimit = Math.max(nPoints, 512);

        const sw = gBounds.getSouthWest();
        const ne = gBounds.getNorthEast();
        const n  = ne.lat();   
        const e  = ne.lng();
        const s  = sw.lat();   
        const w  = sw.lng();

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
                arrLatLng.push(new google.maps.LatLng(lat, lng));
            }
        }

        return this.getElevationForLocations(arrLatLng);
    }
    getRasterForElevationResults(gBounds, projection, results) 
    {
        // Train kriging model.
        const arrX = [], arrY = [], arrZ = [];
        for (const o of results)
        { 
            arrX.push(o.location.lng());
            arrY.push(o.location.lat());
            arrZ.push(o.elevation);
        }
        const model = "spherical", sigma2 = 0, alpha = 100;
        const variogram = kriging.train(arrZ, arrX, arrY, model, sigma2, alpha);

        // Map Coords.
        let sw = gBounds.getSouthWest();
        let ne = gBounds.getNorthEast();
        let n  = ne.lat();   
        let e  = ne.lng();
        let s  = sw.lat();   
        let w  = sw.lng();
        let realWidth  = Math.abs(e - w);
        let realHeight  = Math.abs(n - s);

        // Pixel Coords.
        const psw = projection.fromLatLngToDivPixel(sw);
        const pne = projection.fromLatLngToDivPixel(ne);
        const nCols = (pne.x - psw.x);
        const nRows = (psw.y - pne.y);
        let xRes = realWidth / nCols;
        let yRes = realHeight / nRows;

        // Kriging.
        const values = [];
        let xNew = w, yNew = n;
        for (let row = 0; row < nRows; row++) 
        {
            for (let col = 0; col < nCols; col++) 
            {
                const z = kriging.predict(xNew, yNew, variogram);
                values.push(z);
                xNew += xRes;
            }
            yNew -= yRes;
            xNew = w;
        }

        // Use metres for raster definition.
        const mercator = new GoogleMercator();
        sw = mercator.toMetres(sw.lat(), sw.lng());
        ne = mercator.toMetres(ne.lat(), ne.lng());
        n  = ne.y;   
        e  = ne.x;
        s  = sw.y;   
        w  = sw.x;
        xRes = Math.abs(e - w) / nCols;
        yRes = Math.abs(n - s) / nRows;

        return new Raster({nRows:nRows, nCols:nCols, west:w, south:s, xRes:xRes, yRes:yRes, values:values});
    }
    getRasterForBounds(gBounds, projection) 
    {
        return this.getElevationForBounds(gBounds)
        .then((results) => 
        {
            return new Promise((resolve, reject) => 
            {
                resolve(this.getRasterForElevationResults(gBounds, projection, results));
            });
        });
    }
}