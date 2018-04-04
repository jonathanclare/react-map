import * as Color from './Color' ;

const inColor = 'aliceblue';
test('aliceblue to be a color', () => 
{
	expect(Color.isColor(inColor)).toBeTruthy();
});
test('aliceblue hex value to be #f0f8ff', () => 
{
	expect(Color.toHex(inColor)).toBe('#f0f8ff');
});
test('aliceblue rgb value to be rgba(240,248,255,1)', () => 
{
	expect(Color.toRgba(inColor)).toBe('rgba(240,248,255,1)');
});