export default class GoogleMapsLoader 
{
    constructor({key, client, v, region, language, libraries=[]} = {}) 
    {
    	// key - api key - https://developers.google.com/maps/documentation/javascript/get-api-key
    	this.key = key;

    	// client - for premium authentication - https://developers.google.com/maps/documentation/javascript/get-api-key#premium-auth
    	this.client = client;

    	// v - get a specific version of the api - https://developers.google.com/maps/documentation/javascript/versions
    	this.v = v;
    	
    	// region - localizing the map - https://developers.google.com/maps/documentation/javascript/localization
    	this.region = region;

    	// language - localizing the map - https://developers.google.com/maps/documentation/javascript/localization
    	this.language = language;

    	// libraries - load additionnal libraries - https://developers.google.com/maps/documentation/javascript/libraries
    	this.libraries = libraries;
    }
    load() 
    {
        return new Promise((resolve, reject) => 
        {
			window.initMap = () => resolve();

			const protocol = window.location.protocol === 'file:' ? 'http:' : window.location.protocol;

			let url = protocol+'//maps.googleapis.com/maps/api/js?callback=initMap';
			if (this.key !== undefined) url += '&key=' + this.key;
			if (this.client !== undefined && this.v !== undefined) url += '&client=' + this.client + '&v=' + this.v;
			if (this.region !== undefined) url += '&region=' + this.region;
			if (this.language !== undefined) url += '&language=' + this.language;
			if (this.libraries.length > 0) url += '&libraries=' + this.libraries.join(',');

			const script = document.createElement('script');
			script.src = url;
			script.async = true;
			document.body.appendChild(script);
        })
    }
}