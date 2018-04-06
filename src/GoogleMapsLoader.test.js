import GoogleMapsLoader from './GoogleMapsLoader';

test('renders without crashing', () => 
{
	let g = new GoogleMapsLoader();
	g.load()
	.then((gMaps) => 
	{
		var map = new gMaps.Map(document.getElementById('map'), 
		{
		    center: {lat: -34, lng: 151},
		    zoom: 8
		});
	})
	.catch((err) => 
	{
		console.log('error: ', err.message);
	});
});