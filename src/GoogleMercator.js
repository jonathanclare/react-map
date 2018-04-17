export default class GoogleMercator 
{
    constructor() 
    {
		/* EPSG:7030=SPHEROID["WGS_84",6378137,298.257223563,AUTHORITY["EPSG","7030"]] */
		this._originLat = 0;
		this._originLon = 0;
		this._ellipsoid = {};
		this._ellipsoid["id"] = "WGS_84";
		this._ellipsoid["semiMajorAxis"] = 6378137;
		this._ellipsoid["inverseFlattening"] = 298.257223563;
		if (this._ellipsoid["semiMinorAxis"] === undefined)
		{
			this._ellipsoid["semiMinorAxis"] = this._ellipsoid["semiMajorAxis"] - (this._ellipsoid["semiMajorAxis"] / this._ellipsoid["inverseFlattening"]);
		}
		if (this._ellipsoid["eccentricity"] === undefined) {
		
			const f = (this._ellipsoid["semiMajorAxis"] - this._ellipsoid["semiMinorAxis"]) / this._ellipsoid["semiMajorAxis"];
			const e2 = (2 * f) - (f * f);
			this._ellipsoid["eccentricity"] = Math.sqrt(e2);
		}
    }
    toMetres(lat, lng, useEllipsoid = true)
    { 
		const rLng = Math.PI * (lng / 180.0);
		const rLngOrigin = Math.PI * (this._originLon / 180.0);
		const rLat = Math.PI * (lat / 180.0);
		const radius = this._ellipsoid["semiMajorAxis"];
		return {x:(radius * (rLng - rLngOrigin)), y:(radius * Math.log(Math.tan((Math.PI / 4) + (rLat / 2))))};	
    }
    toLatLng(xm, ym, useEllipsoid = true)
    { 
		const rLngOrigin = Math.PI * (this._originLon / 180.0);
		const radius = this._ellipsoid["semiMajorAxis"];
		const rLng = (xm / radius) + rLngOrigin;
		const d = (0 - ym) / radius;
		const rLat = (Math.PI / 2.0) - (2 * Math.atan(Math.pow(Math.E, d)));
		return {lat:((rLat * 180.0) / Math.PI), lng:((rLng * 180.0) / Math.PI)};
    }
}