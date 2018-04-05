/* global google */
export default class GoogleMapsLoader 
{
    constructor() 
    {

    }
    load() 
    {
        return new Promise((resolve, reject) => 
        {
			const initMap = () =>  resolve(google.maps);
			window.initMap = initMap;
			var script = document.createElement('script');
			var protocol = window.location.protocol === "file:" ? "http:" : window.location.protocol;
			var apiKey = 'AIzaSyABGvJPIPG0O1qsBjVbFYpx4bp_ShWpM98';
			script.src = protocol+'//maps.googleapis.com/maps/api/js?key='+apiKey+'&callback=initMap&libraries=drawing';
			script.async = true;
			document.body.appendChild(script);
        })
    }
}