/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import GoogleMapsLoader from './GoogleMapsLoader';
import RasterOverlay from './RasterOverlay';
import RectangleControl  from './RectangleControl'; 
import ElevationService  from './ElevationService'; 
import * as Color from './Color' ;
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
    const overlay = new RasterOverlay(map);
    const elevator = new ElevationService();

    const rectCtrl = new RectangleControl(
    {
        fillColor: '#000000',
        fillOpacity: 0,
        strokeColor: '#000000',
        strokeWeight: 1,
        onBoundsChanged: gBounds => generateRaster(gBounds)
    });
    rectCtrl.attach(map);

    const btn = document.getElementById('btn');
    btn.addEventListener('click', function()
    {
        generateRaster(map.getBounds());
    });

    const generateRaster = gBounds =>
    {
        overlay.setBounds(gBounds);
        elevator.getRasterForBounds(gBounds, overlay.overlay.getProjection())
        .then((raster) => 
        {
            const colorRamp = ['#f0ece9', '#baa191', '#fcc46d', '#e9d59c', '#5d8a41'];
            const imgData = overlay.context.createImageData(raster.nCols, raster.nRows);
            let index = 0;
            for (let z of raster.rast)
            {
                const f = (raster.max - z) / raster.range;
                const o = Color.getColorAt(colorRamp, f);
                imgData.data[index] = o.r; 
                imgData.data[index+1] = o.g;  
                imgData.data[index+2] = o.b;  
                imgData.data[index+3] = 0.8 * 255; 
                index += 4;
            }
            overlay.context.putImageData(imgData, 0, 0);
        })
        .catch((err) => 
        {
            console.log('error: ', err);
        });
    };
});

//ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();