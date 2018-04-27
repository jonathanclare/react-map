import Color from './Color' ;

const c = new Color('aliceblue');
test('aliceblue hex value to be #f0f8ff', () => 
{
	expect(c.hex()).toBe('#f0f8ff');
});
test('aliceblue rgba value to be {r:240, g:248, b:255, a:1}', () => 
{
	expect(c.r).toEqual(240);
	expect(c.g).toEqual(248);
	expect(c.b).toEqual(255);
	expect(c.a).toEqual(1);
});
test('aliceblue rgba string value to be rgba(240,248,255,1)', () => 
{
	expect(c.rgbaString()).toBe('rgba(240,248,255,1)');
});
test('aliceblue hsva value to be {h:208,s:6,v:100,a:1}', () => 
{
	var hsva = c.hsva();
	expect(hsva.h).toEqual(208);
	expect(hsva.s).toEqual(6);
	expect(hsva.v).toEqual(100);
	expect(hsva.a).toEqual(1);
});
test('aliceblue hsva string value to be hsva(208,6,100,1)', () => 
{
	expect(c.hsvaString()).toBe('hsva(208,6,100,1)');
});
test('aliceblue hsla value to be {h:208,s:100,l:97,a:1}', () => 
{
	var hsla = c.hsla();
	expect(hsla.h).toEqual(208);
	expect(hsla.s).toEqual(100);
	expect(hsla.l).toEqual(97);
	expect(hsla.a).toEqual(1);
});
test('aliceblue hsla string value to be hsla(208,100,97,1)', () => 
{
	expect(c.hslaString()).toBe('hsla(208,100,97,1)');
});

// hsla(208,100,97,1)
const c2 = new Color({h:208,s:100,l:97,a:1});
test('{h:208,s:100,l:97,a:1} rgba value to be {r:240, g:248, b:255, a:1}', () => 
{
	expect(c2.r).toEqual(240);
	expect(c2.g).toEqual(248);
	expect(c2.b).toEqual(255);
	expect(c2.a).toEqual(1);
});
const c3 = new Color('hsla(208,100,97,1)');
test('hsla(208,100,97,1) value to be {r:240, g:248, b:255, a:1}', () => 
{
	expect(c3.r).toEqual(240);
	expect(c3.g).toEqual(248);
	expect(c3.b).toEqual(255);
	expect(c3.a).toEqual(1);
});

// hsva(240,248,255,1)
const c4 = new Color({h:208,s:6,v:100,a:1});
test('{h:208,s:6,v:100,a:1} rgba value to be {r:240, g:248, b:255, a:1}', () => 
{
	expect(c4.r).toEqual(240);
	expect(c4.g).toEqual(248);
	expect(c4.b).toEqual(255);
	expect(c4.a).toEqual(1);
});
const c5 = new Color('hsva(208,6,100,1)');
test('hsva(208,6,100,1) rgba value to be {r:240, g:248, b:255, a:1}', () => 
{
	expect(c5.r).toEqual(240);
	expect(c5.g).toEqual(248);
	expect(c5.b).toEqual(255);
	expect(c5.a).toEqual(1);
});

// #f0f8ff
const c6 = new Color('#f0f8ff');
test('#f0f8ff rgba value to be {r:240, g:248, b:255, a:1}', () => 
{
	expect(c6.r).toEqual(240);
	expect(c6.g).toEqual(248);
	expect(c6.b).toEqual(255);
	expect(c6.a).toEqual(1);
});

// rgb(240,248,255,1)
const c7 = new Color({r:240, g:248, b:255, a:1});
test('{r:240, g:248, b:255, a:1} rgba value to be {r:240, g:248, b:255, a:1}', () => 
{
	expect(c7.r).toEqual(240);
	expect(c7.g).toEqual(248);
	expect(c7.b).toEqual(255);
	expect(c7.a).toEqual(1);
});
const c8 = new Color('rgba(240,248,255,1)');
test('rgba(240,248,255,1) value to be {r:240, g:248, b:255, a:1}', () => 
{
	expect(c8.r).toEqual(240);
	expect(c8.g).toEqual(248);
	expect(c8.b).toEqual(255);
	expect(c8.a).toEqual(1);
});