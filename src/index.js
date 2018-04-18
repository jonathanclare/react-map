/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import GoogleMapsLoader from './GoogleMapsLoader';
import RasterOverlay from './RasterOverlay';
import * as RasterAlgebra from './RasterAlgebra';
import RectangleControl  from './RectangleControl'; 
import ElevationService  from './ElevationService'; 
import * as Color from './Color' ;
import {isNumber} from './utils' ;
import registerServiceWorker from './registerServiceWorker';

const g = new GoogleMapsLoader({key: 'AIzaSyABGvJPIPG0O1qsBjVbFYpx4bp_ShWpM98', libraries: ['drawing']});
g.load().then(() => 
{
	// Create map.
    const map = new google.maps.Map(document.getElementById('map'), 
    {
		zoom: 11,
		center: {lat: 62.68216808416764, lng: -150.70869324223156},
    });

    map.addListener('idle', function() 
    {
        var z = map.getZoom();
        var c = map.getCenter();
        console.log(z+' '+c.lat()+' '+c.lng());
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
            surface(raster, overlay);
            hillshade(raster, overlay);
        })
        .catch((err) => 
        {
            console.log('error: ', err);
        });
    };
});

const surface = (raster, overlay) =>
{
    const colorRamp = ['#f0ece9', '#baa191', '#fcc46d', '#e9d59c', '#5d8a41'];
    const imgData = overlay.context.createImageData(raster.nCols, raster.nRows);
    let index = 0;
    for (let cell of raster.cells)
    {
        const f = (raster.max - cell.value) / raster.range;
        const c = Color.getColorAt(colorRamp, f);
        imgData.data[index] = c.r; 
        imgData.data[index+1] = c.g;  
        imgData.data[index+2] = c.b;  
        imgData.data[index+3] = 0.8 * 255; 
        index += 4;
    }
    overlay.context.putImageData(imgData, 0, 0);
}

const hillshade = (raster, overlay) =>
{
    const hillshade = RasterAlgebra.hillshade(raster);
    const imgData = overlay.context.createImageData(hillshade.nCols, hillshade.nRows);
    let index = 0;

    for (let cell of hillshade.cells)
    {
        imgData.data[index] = cell.value; 
        imgData.data[index+1] = cell.value;  
        imgData.data[index+2] = cell.value;  
        imgData.data[index+3] = 0.8 * 255; 
        index += 4;
    }
    overlay.context.putImageData(imgData, 0, 0);
}

//ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();