/* global google */
export default class RasterOverlay
{
    constructor(map, raster) 
    {
    	var me = this;

	    // Create the canvas element.
	    this._canvas = document.createElement('canvas');
	    this._canvas.style.position = 'absolute';
	    this._context = this._canvas.getContext('2d');

      	const bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(62.281819, -150.287132),
            new google.maps.LatLng(62.400471, -150.005608));

	    // Overlay creation.
    	const Overlay = function (map) {this.setMap(map);}
    	Overlay.prototype = new google.maps.OverlayView(); 
    	Overlay.prototype.onAdd = function () 
    	{
    		console.log('onAdd');

		    // Add the element to the overlay pane.
		    const panes = this.getPanes();
		    panes.overlayLayer.appendChild(me._canvas);
    	};
    	Overlay.prototype.draw = function () 
    	{
    		console.log('draw');

		    // Map Coords.
		    var sw = bounds.getSouthWest();
		    var ne = bounds.getNorthEast();
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

		    // Resize the canvas.
		    me._canvas.style.left = px + 'px';
		    me._canvas.style.top = py + 'px';
		    me._canvas.width = pw;
		    me._canvas.height = ph;

			me._context.rect(0,0,pw,ph);
			me._context.stroke();
    	};
    	Overlay.prototype.onRemove = function () 
    	{
		    console.log('onRemove');

		    me._canvas.parentNode.removeChild(me._canvas);
		    me._canvas = null;
    	};
    	this.overlay = new Overlay(map);
    }
    setRaster(rasterCanvas) 
    {
    	this.rasterCanvas = rasterCanvas;
    	// use getImage method from raster class to draw it or raster canvas.
  	}
    hide() 
    {
  		if (this._canvas) this._canvas.style.visibility = 'hidden';
  	}
    show() 
    {
  		if (this._canvas) this._canvas.style.visibility = 'visible';
  	}
    toggle() 
    {
  		if (this._canvas) 
  		{
		    if (this._canvas.style.visibility === 'hidden')  this.show();
		    else this.hide();
  		}
  	}
}