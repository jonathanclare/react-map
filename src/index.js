import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Raster from './Raster';
import GoogleMapsLoader from './GoogleMapsLoader';
import ElevationService from './ElevationService';
import registerServiceWorker from './registerServiceWorker';


let g = new GoogleMapsLoader();
g.load()
.then((gMaps) => 
{
    var map = new gMaps.Map(document.getElementById('map'), 
    {
        center: {lat: -34, lng: 151},
        zoom: 8
    });

	// 81.74104309082031
	let es = new ElevationService(gMaps);
	es.getElevationForLocations([new gMaps.LatLng(-34, 151)])
	.then((results) => 
	{
		console.log("got", results[0].elevation);
	})
	.catch((err) => 
	{
		console.log("error: ", err.message);
	});

})
.catch((err) => 
{
	console.log("error: ", err.message);
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();