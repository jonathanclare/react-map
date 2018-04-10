/* global google */
/* global kriging */
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
    getDEMForBounds(gBounds, projection) 
    {
        return this.getElevationForBounds(gBounds)
        .then((results) => 
        {
            return new Promise((resolve, reject) => 
            {
                const raster = this.getDEMForElevationResults(gBounds, projection, results);
                resolve(raster);
            });
        });
    }
    getDEMForElevationResults(gBounds, projection, results) 
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

        // Calculate min, max and range of elevation.
        const minElevation = Math.min.apply(Math,results.map(function(o){return o.elevation;}));
        const maxElevation = Math.max.apply(Math,results.map(function(o){return o.elevation;}));
        const rangeElevation = maxElevation - minElevation;

        // Map Coords.
        const sw = gBounds.getSouthWest();
        const ne = gBounds.getNorthEast();
        const n  = ne.lat();   
        const e  = ne.lng();
        const s  = sw.lat();   
        const w  = sw.lng();
        const rw  = Math.abs(e - w);
        const rh  = Math.abs(n - s);

        // Pixel Coords.
        const psw = projection.fromLatLngToDivPixel(sw);
        const pne = projection.fromLatLngToDivPixel(ne);
        const px = psw.x;
        const py = pne.y;
        const pw = (pne.x - psw.x);
        const ph = (psw.y - pne.y);

        // Build raster.
        const raster = [];
        let xNew = w, yNew = n;
        for (let i = 0; i < ph; i++) 
        {
            raster.push([]);
            for (let j = 0; j < pw; j++) 
            {
                raster[i][j] = kriging.predict(xNew, yNew, variogram);
                xNew += (rw / pw);
            }
            yNew -= (rh / ph);
            xNew = w;
        }

        return {min:minElevation, max:maxElevation, range:rangeElevation, values:raster};
    }
}