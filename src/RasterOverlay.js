/* global google */
export default class RasterOverlay
{
    constructor(map, raster) 
    {
    	var me = this;

	    // Create the canvas element.
	    this.canvas = document.createElement('canvas');
	    this.canvas.style.position = 'absolute';
	    this.context = this.canvas.getContext('2d');

	    // Overlay creation.
    	const Overlay = function (map) {this.setMap(map);}
    	Overlay.prototype = new google.maps.OverlayView(); 
    	Overlay.prototype.onAdd = function () 
    	{
		    const panes = this.getPanes();
		    panes.overlayLayer.appendChild(me.canvas);
    	};
    	Overlay.prototype.draw = function () 
    	{
    		console.log('draw');
            if (me.gBounds !== undefined)
            {
                // Map Coords.
                const sw = me.gBounds.getSouthWest();
                const ne = me.gBounds.getNorthEast();

                // Pixel Coords.
                const overlayProjection = this.getProjection();
                const psw = overlayProjection.fromLatLngToDivPixel(sw);
                const pne = overlayProjection.fromLatLngToDivPixel(ne);
                const px = psw.x;
                const py = pne.y;
                const pw = (pne.x - psw.x);
                const ph = (psw.y - pne.y);

                // Resize the canvas.
                me.canvas.style.left = px + 'px';
                me.canvas.style.top = py + 'px';
                me.canvas.width = pw;
                me.canvas.height = ph;
            }
    	};
    	Overlay.prototype.onRemove = function () 
    	{
		    me.canvas.parentNode.removeChild(me.canvas);
		    me.canvas = null;
    	};

    	this.overlay = new Overlay(map);
    }
    setBounds(gBounds) 
    {
        this.gBounds = gBounds;
        this.overlay.draw();
  	}
    hide() 
    {
  		if (this.canvas) this.canvas.style.visibility = 'hidden';
  	}
    show() 
    {
  		if (this.canvas) this.canvas.style.visibility = 'visible';
  	}
    toggle() 
    {
  		if (this.canvas) 
  		{
		    if (this.canvas.style.visibility === 'hidden')  this.show();
		    else this.hide();
  		}
  	}
}