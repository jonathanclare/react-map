import GoogleMapsLoader from './GoogleMapsLoader';
import ElevationService from './ElevationService';

test('expect elevation not to crash', () => 
{
	let g = new GoogleMapsLoader();
	g.load().then(() => 
	{
		let elevator = new ElevationService(google.maps);

		const gBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(62.281819, -150.287132),
            new google.maps.LatLng(62.400471, -150.005608));

		elevator.getElevationForBounds(gBounds)
		.then((results) => 
		{

		})
		.catch((err) => 
		{
			console.log('error: ', err);
		});
	});
});