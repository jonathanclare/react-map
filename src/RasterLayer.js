Raster.prototype = new google.maps.OverlayView();

/** @constructor */
function Raster(map) 
{
    console.log('Raster');

    // Define a property to hold the image's div. We'll
    // actually create this div upon receipt of the onAdd()
    // method so we'll leave it null for now.
    this._div = null;
    this._canvas = null;
    this._bounds = null;

    // Explicitly call setMap on this overlay.
    this.setMap(map);
}

/**
* onAdd is called when the map's panes are ready and the overlay has been
* added to the map.
*/
Raster.prototype.onAdd = function() 
{
    console.log('onAdd');

    this._div = document.createElement('div');
    this._div.style.borderStyle = 'none';
    this._div.style.borderWidth = '0px';
    this._div.style.position = 'absolute';

    // Create the img element and attach it to the div.
    this._canvas = document.createElement('canvas');
    this._canvas.style.position = 'absolute';
    this._div.appendChild(this._canvas);
    this._context = this._canvas.getContext("2d");

    // Add the element to the "overlayLayer" pane.
    var panes = this.getPanes();
    panes.overlayLayer.appendChild(this._div);
};

Raster.prototype.draw = function() 
{
    console.log('draw');
    if (this._bounds !== null && doRaster)
    {
        doRaster = false;

        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.

        // Map Coords.
        var sw = this._bounds.getSouthWest();
        var ne = this._bounds.getNorthEast();
        var n  = ne.lat();   
        var e  = ne.lng();
        var s  = sw.lat();   
        var w  = sw.lng();

        // Pixel Coords.
        var overlayProjection = this.getProjection();
        var psw = overlayProjection.fromLatLngToDivPixel(sw);
        var pne = overlayProjection.fromLatLngToDivPixel(ne);
        var px = psw.x;
        var py = pne.y;
        var pw = (pne.x - psw.x);
        var ph = (psw.y - pne.y);

        // Resize the div to fit the indicated dimensions.
        this._div.style.left = px + 'px';
        this._div.style.top = py + 'px';
        this._div.style.width = pw + 'px';
        this._div.style.height = ph + 'px';

        // Resize the canvas.
        this._canvas.width = pw;
        this._canvas.height = ph;

        // Create points grid.
        var quotaLimit = 512;
        //var quotaLimit = 100;
        var noPointsAlongSide = Math.floor(Math.sqrt(quotaLimit));
        var incrLat = (n - s) / (noPointsAlongSide - 1);
        var incrLng = (e - w) / (noPointsAlongSide - 1);
        var arrLatLng = [];
        for (var i = 0; i < noPointsAlongSide; i++) 
        {
            lat = n - (incrLat * i);
            for (var j = 0; j < noPointsAlongSide; j++) 
            {
                lng = w + (incrLng * j)
                arrLatLng.push(new google.maps.LatLng(lat, lng));
            }
        }

        var me = this;

        // Initiate the location request
        elevator.getElevationForLocations(
        {
            'locations': arrLatLng
        }, 
        function(results, status) 
        {
            //console.log(results);
            if (status === 'OK') 
            {
                // Get min and max elevations and populate x, y, z, arrays.
                var arrX = [], arrY = [], arrZ = [], minE = Infinity, maxE = -Infinity;
                for (var i = 0; i < results.length; i++) 
                { 
                    var r = results[i];
                    maxE = Math.max(maxE, r.elevation);
                    minE = Math.min(minE, r.elevation);

                    var pt = overlayProjection.fromLatLngToDivPixel(r.location);
                    var ptx = pt.x  - px;
                    var pty = pt.y  - py; 
                    arrX.push(ptx);
                    arrY.push(pty);
                    arrZ.push(r.elevation);
                }

                var rw = pw / (noPointsAlongSide - 1);
                var rh = ph / (noPointsAlongSide - 1);
                for (var i = 0; i < arrX.length; i++) 
                { 
                    var x = arrX[i];
                    var y = arrY[i]; 
                    var z = arrZ[i]; 

                    var f = (z - minE) / (maxE - minE);
                    var c = Math.floor(f * 255);
                    //me._context.fillStyle = 'rgb('+c+', '+c+', '+c+')';
                    //me._context.fillRect(x,y,rw,rh); 
                }


                //console.log(maxE+" "+minE);
                console.log(pw+" "+ph);
                //console.log(arrX);
                //console.log(arrY);
                //console.log(arrZ);

                // Create variogram for DEM creation.
                var model = "spherical", sigma2 = 0, alpha = 100;
                var variogram = kriging.train(arrZ, arrX, arrY, model, sigma2, alpha);


                    /*var z = kriging.predict(0, 0, variogram);
                    console.log(z)

                    var z = kriging.predict(pw, ph, variogram);
                    console.log(z)*/

                var c1 = '#ff0000';    
                var c2 = '#00ff00';    


                // Image data.
                // ImageData.data is a one-dimensional array containing the data in the RGBA order, 
                // with integer values between 0 and 255. ie Each pixel is represented in 
                // imgData.data by 4 values for each component of RGBA.
                var imgData = me._context.createImageData(pw, ph);
                var arrT = [];
                var xNew = 0, yNew = 0;
                for (var i = 0; i < imgData.data.length; i += 4) 
                {

                    var z = kriging.predict(xNew, yNew, variogram);
                    var f = (maxE - z) / (maxE - minE);
                    //var c = Math.floor(f * 255);


                    var c =  ia.Color.getInterpolatedColor(c1, c2, f);

                    imgData.data[i] = ia.Color.r(c); 
                    imgData.data[i+1] = ia.Color.g(c);  
                    imgData.data[i+2] = ia.Color.b(c);  
                    imgData.data[i+3] = 0.8 * 255; 


                    /*var f = (pw - xNew) / pw;
                    var c = Math.floor(f * 255);
                    imgData.data[i] = c; 
                    imgData.data[i+1] = c; 
                    imgData.data[i+2] = c; 
                    imgData.data[i+3] = 255; */

                    xNew += 1
                    if (xNew === pw)
                    {
                        xNew = 0;
                        yNew += 1;
                    }
                }
                me._context.putImageData(imgData, 0, 0);
                console.log(arrT);
            }
        });
    }
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
Raster.prototype.onRemove = function() 
{
    console.log('onRemove');
    this._div.parentNode.removeChild(this._div);
    this._div = null;
};

Raster.prototype.setBounds = function(gBounds) 
{
    console.log('setBounds');
    this._bounds = gBounds;
    this.draw();
};