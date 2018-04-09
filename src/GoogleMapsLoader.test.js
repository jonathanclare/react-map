import GoogleMapsLoader from './GoogleMapsLoader';

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
	});
});