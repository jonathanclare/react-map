/* global kriging */
import Raster from './Raster';
import GoogleMercator from './GoogleMercator';
import ElevationService  from './ElevationService'; 

export default class Krig 
{
    constructor(map) 
    {
        this.map = map;
        this.elevator = new ElevationService();
    }
    getRasterForBounds(gBounds)
    {
        return this.elevator.getElevationForBounds(gBounds)
        .then((results) => 
        {
            return new Promise((resolve, reject) => 
            {
                resolve(this.getRasterFromElevationResults(gBounds, results));
            });
        });
    }
    getRasterFromElevationResults(gBounds, results)
    {
        const mercator = new GoogleMercator();

        // Train kriging model.
        const arrX = [], arrY = [], arrZ = [];
        for (const o of results)
        { 
            const m = mercator.toMetres(o.location);
            arrX.push(m.x);
            arrY.push(m.y);
            arrZ.push(o.elevation);
        }
        const model = "spherical", sigma2 = 0, alpha = 100;
        const variogram = kriging.train(arrZ, arrX, arrY, model, sigma2, alpha);

        // Map Coords.
        let sw = gBounds.getSouthWest();
        let ne = gBounds.getNorthEast();

        // Pixel Coords.
        const psw = mercator.toPixels(this.map, sw);
        const pne = mercator.toPixels(this.map, ne);
        const nCols = (pne.x - psw.x);
        const nRows = (psw.y - pne.y);

        // Use metres for raster definition.
        const msw = mercator.toMetres(sw);
        const mne = mercator.toMetres(ne);
        const n  = mne.y;   
        const e  = mne.x;
        const s  = msw.y;   
        const w  = msw.x;
        const xRes = Math.abs(e - w) / nCols;
        const yRes = Math.abs(n - s) / nRows;

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

        return new Raster({nRows:nRows, nCols:nCols, west:w, south:s, xRes:xRes, yRes:yRes, values:values});
    }
}