/* global google */
/* global kriging */
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
            rOverlay.setBounds(gBounds);
            elevator.getDEMForBounds(gBounds, rOverlay.overlay.getProjection())
            .then((raster) => 
            {
                const imgData = rOverlay.context.createImageData(raster.cols, raster.rows);
                let index = 0;
                for (let z of raster.values)
                {
                    const f = (raster.max - z) / raster.range;
                    const o = Color.getInterpolatedColor('#ff0000', '#00ff00', f);
                    imgData.data[index] = o.r; 
                    imgData.data[index+1] = o.g;  
                    imgData.data[index+2] = o.b;  
                    imgData.data[index+3] = 0.8 * 255; 
                    index += 4;
                }
                rOverlay.context.putImageData(imgData, 0, 0);
            })
            .catch((err) => 
            {
                console.log('error: ', err);
            });
        }
    });
    rectCtrl.attach(map);
});

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();