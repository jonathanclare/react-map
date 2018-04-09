/* global google */
import {debounce} from './utils'; 
export default class RectangleControl 
{
    constructor({onBoundsChanged = gBounds => {}, fillColor='#000000', fillOpacity='0.5', strokeColor='#000000', strokeWeight=1, clickable=true, draggable=true, editable=true} = {}) 
    {
        // Drawing manager.
        this.drawingManager = new google.maps.drawing.DrawingManager(
        {
            drawingMode: google.maps.drawing.OverlayType.RECTANGLE,
            drawingControlOptions: 
            {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: ['rectangle']
            },
            rectangleOptions: 
            {
                fillColor: fillColor,
                fillOpacity: fillOpacity,
                strokeColor: strokeColor,
                strokeWeight: strokeWeight,
                clickable: clickable,
                draggable: draggable,
                editable: editable,
                zIndex: 1
            }
        });

        let rect = null;
        google.maps.event.addListener(this.drawingManager, 'rectanglecomplete', r =>
        {
            if (rect !== null) 
            {
                rect.setMap(null);
                google.maps.event.clearInstanceListeners(rect);
                rect = null;
            }
            rect = r;
            google.maps.event.addListener(rect, 'bounds_changed', () =>
            {
                setBounds(rect.getBounds());
            });
            setBounds(rect.getBounds());

            // Switch back to non-drawing mode after drawing the rectangle.
            this.drawingManager.setDrawingMode(null);
        });

        const setBounds = debounce(gBounds => onBoundsChanged(gBounds));
    }
    attach(map)
    {
        this.drawingManager.setMap(map);
    }
    detach()
    {
        this.drawingManager.setMap(null);
    }
}