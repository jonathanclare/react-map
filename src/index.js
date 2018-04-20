/* global google */
//import React from 'react';
//import ReactDOM from 'react-dom';
//import './index.css';
//import App from './App';
import GoogleMapsLoader from './GoogleMapsLoader';
import RectangleControl  from './RectangleControl'; 
import RasterRenderer  from './RasterRenderer'; 
import Krig from './Krig'; 
import ColorTable  from './ColorTable';
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
    const krig = new Krig(map);

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
        krig.getRasterForBounds(gBounds, map)
        .then((raster) => 
        {
            const colorTable = new ColorTable();
            colorTable.addColorRule(['#5d8a41', '#e9d59c', '#fcc46d', '#baa191', '#f0ece9'], raster.min, raster.max);
            addGroundOverlay(map, raster, gBounds, colorTable)
            //const hillshadeRast = RasterAlgebra.hillshade(raster);
            //addGroundOverlay(map, hillshadeRast, gBounds, new ColorTable([{colors:['#000000', '#ffffff'],  min:0, max:255}]));
        })
        .catch((err) => 
        {
            console.log('error: ', err);
        });
    };
});

const addGroundOverlay = (map, raster, gBounds, colorTable) =>
{
    const renderer = new RasterRenderer(raster);
    renderer.getDataUrl(colorTable).then((dataUrl) =>
    {
        const overlay = new google.maps.GroundOverlay(dataUrl, gBounds);
        overlay.setMap(map);
    })
    .catch((err) => 
    {
        console.log('error: ', err);
    });
}

//ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();