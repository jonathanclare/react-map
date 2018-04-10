/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import GoogleMapsLoader from './GoogleMapsLoader';
import RasterOverlay from './RasterOverlay';
import RectangleControl  from './RectangleControl'; 
import ElevationService  from './ElevationService'; 
import registerServiceWorker from './registerServiceWorker';

const g = new GoogleMapsLoader({key: 'AIzaSyABGvJPIPG0O1qsBjVbFYpx4bp_ShWpM98', libraries: ['drawing']});
g.load().then(() => 
{
	// Create map.
    const map = new google.maps.Map(document.getElementById('map'), 
    {
		zoom: 11,
		center: {lat: 62.323907, lng: -150.109291},
    });

    // Overlay to draw raster onto.
    const rOverlay = new RasterOverlay(map);
    const elevator = new ElevationService();

    const rectCtrl = new RectangleControl(
    {
        fillColor: '#000000',
        fillOpacity: 0,
        strokeColor: '#000000',
        strokeWeight: 1,
        onBoundsChanged: gBounds =>
        {
            elevator.getElevationForBounds(gBounds)
            .then((results) => 
            {
                console.log(results);
            })
            .catch((err) => 
            {
                console.log('error: ', err);
            })
            .then(() => 
            {
                // Clear the old canvas whatever happens
            });
        }
    });
    rectCtrl.attach(map);
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();