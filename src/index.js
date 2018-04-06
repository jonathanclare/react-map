import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import GoogleMapsLoader from './GoogleMapsLoader';
import RasterOverlay from './RasterOverlay';
import registerServiceWorker from './registerServiceWorker';


let g = new GoogleMapsLoader({key: 'AIzaSyABGvJPIPG0O1qsBjVbFYpx4bp_ShWpM98', libraries: ['drawing']});
g.load()
.then((gMaps) => 
{
	// Create map.
    var map = new gMaps.Map(document.getElementById('map'), 
    {
		zoom: 11,
		center: {lat: 62.323907, lng: -150.109291},
    });

    // Overlay to draw raster onto.
    var overlay = new RasterOverlay(gMaps, map);

	/*R.prototype = new gMaps.OverlayView(); 
	function R(map) {this.setMap(map);}
	R.prototype.onAdd = function () {console.log('onAdd')}
	R.prototype.draw = function () {console.log('draw')}
	R.prototype.onRemove = function () {console.log('onRemove')}
	var s = new R(map);*/

    // Add drawing manager.
    var drawingManager = new gMaps.drawing.DrawingManager(
    {
        drawingMode: gMaps.drawing.OverlayType.RECTANGLE,
        drawingControl: true,
        drawingControlOptions: 
        {
            position: gMaps.ControlPosition.TOP_CENTER,
            drawingModes: ['rectangle']
        },
        rectangleOptions: 
        {
            fillColor: '#0000ff',
            fillOpacity: 0.1,
            strokeColor: '#0000ff',
            strokeWeight: 1,
            clickable: true,
            draggable: true,
            editable: true,
            zIndex: 1
        }
    });
    drawingManager.setMap(map);
})
.catch((err) => 
{
	console.log('error: ', err.message);
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();