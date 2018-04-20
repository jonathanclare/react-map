/* global google */
export default class GoogleMercator 
{
    toMetres(latLng)
    { 
		const radius = 6378137;
		const rLng = Math.PI * (latLng.lng() / 180.0);
		const rLat = Math.PI * (latLng.lat() / 180.0);
		const x = radius * rLng;
		const y = radius * Math.log(Math.tan((Math.PI / 4) + (rLat / 2)));
		return new google.maps.Point(x, y);
    }
    toLatLng(xm, ym)
    { 
		const radius = 6378137;
		const rLng = xm / radius;
		const d = (0 - ym) / radius;
		const rLat = (Math.PI / 2.0) - (2 * Math.atan(Math.pow(Math.E, d)));
		const lat = (rLat * 180.0) / Math.PI
		const lng = (rLng * 180.0) / Math.PI;
		return new google.maps.LatLng(lat, lng);
    }
    toPixels(map, latLng)
    { 
		const projection = map.getProjection();
		const bounds = map.getBounds();
		const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
		const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
		const scale = Math.pow(2, map.getZoom());
		const worldPoint = projection.fromLatLngToPoint(latLng);
		const x = Math.floor((worldPoint.x - bottomLeft.x) * scale);
		const y = Math.floor((worldPoint.y - topRight.y) * scale);
		return new google.maps.Point(x, y);
    }
}