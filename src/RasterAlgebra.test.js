import * as RasterAlgebra from './RasterAlgebra';

const altitude = 45;
const azimuth = 315;      
const matrix = {a:2450, b:2461, c:2483, d:2452, e:2461, f:2483, g:2447, h:2455, i:2477};
const xRes = 5;
const yRes = 5;
const change = RasterAlgebra.getRateOfChange(matrix, xRes, yRes);

test('dx to be close to 3.125 and dy to be close to -0.525', () => 
{
	expect(change.x).toBeCloseTo(3.125);
	expect(change.y).toBeCloseTo(-0.525);
});

test('aspect to be close to 3.310567', () => 
{
	expect(RasterAlgebra.getAspect(change.y, change.x)).toBeCloseTo(3.310567);
});

test('slope to be close to 1.26511', () => 
{
	expect(RasterAlgebra.getSlope(change.y, change.x)).toBeCloseTo(1.26511);
});

test('hillshade to equal 154', () => 
{
	expect(RasterAlgebra.getHillshade(change.y, change.x, altitude, azimuth)).toEqual(154);
});
