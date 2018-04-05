import GoogleMapsLoader from './GoogleMapsLoader';
import ElevationService from './ElevationService';

test('expect elevation for (-34, 151) to be close to 81.74104309082031', () => 
{
	let g = new GoogleMapsLoader();
	g.load()
	.then((gMaps) => 
	{
		let es = new ElevationService(gMaps);
		es.getElevationForLocations([new gMaps.LatLng(-34, 151)])
		.then((results) => 
		{
	  		expect(results[0].elevation).toBeCloseTo(81); // 81.74104309082031
		})
		.catch((err) => 
		{
			console.log('error: ', err.message);
		});
	})
	.catch((err) => 
	{
		console.log('error: ', err.message);
	});
});