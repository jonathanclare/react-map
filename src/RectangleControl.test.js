import GoogleMapsLoader from './GoogleMapsLoader';
import RectangleControl  from './RectangleControl';

test('renders without crashing', () => 
{
    let g = new GoogleMapsLoader();
    g.load().then(() => 
    {
        var map = new google.maps.Map(document.getElementById('map'), 
        {
            center: {lat: -34, lng: 151},
            zoom: 8
        });
        const rectTool = new RectangleTool(
        {
            fillColor: '#000000',
            fillOpacity: 0,
            strokeColor: '#000000',
            strokeWeight: 1,
            onBoundsChanged: gBounds => {}
        });
        rectTool.attach(map);
    });
});