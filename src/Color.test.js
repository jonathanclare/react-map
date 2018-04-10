import * as Color from './Color' ;

const inColor = 'aliceblue';
test('aliceblue hex value to be #f0f8ff', () => 
{
	expect(Color.toHex(inColor)).toBe('#f0f8ff');
});
test('aliceblue rgb string value to be rgba(240,248,255,1)', () => 
{
	expect(Color.toRgbaString(inColor)).toBe('rgba(240,248,255,1)');
});
test('aliceblue rgb value to be {r:240, g:248, b:255, a:1}', () => 
{
	var c = Color.toRgba(inColor);
	expect(c.r).toEqual(240);
	expect(c.g).toEqual(248);
	expect(c.b).toEqual(255);
});
test('aliceblue hsv value to be {h:208,s:6,v:100}', () => 
{
	var c = Color.toHsv(inColor);
	expect(c.h).toEqual(208);
	expect(c.s).toEqual(6);
	expect(c.v).toEqual(100);
});