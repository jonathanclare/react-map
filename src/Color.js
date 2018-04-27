export default class Color
{
    constructor({r, g, b, h, s, l, v, a = 1} = {}) 
    {
        let args = arguments[0];
        let c;
        if (typeof args === 'object') // object: rgba, hsla, hsva.
        {
            if (r !== undefined && g !== undefined && b !== undefined) // rgb object.
                c = {r:r, g:g, b:b, a:a};
            else if (h !== undefined && s !== undefined && l !== undefined) // hsl object.
                c = hslaToRgba(h, s, l, a);
            else if (h !== undefined && s !== undefined && v !== undefined) // hsv object.
                c = hsvaToRgba(h, s, v, a);
        }
        else if (typeof args === 'string') // css string.
        {  
            switch(getColorType(args))
            {
                case 'rgb': 
                    c = rgbaStringToRgba(args); 
                    break;
                case 'hsl': 
                    const hsla = hslaStringToHsla(args);
                    c = hslaToRgba(hsla.h, hsla.s, hsla.l, hsla.a);
                    break;
                case 'hsv': 
                    const hsva = hsvaStringToHsva(args);
                    c = hsvaToRgba(hsva.h, hsva.s, hsva.v, hsva.a);
                    break;
                case 'hex': 
                    c = hexToRgba(args);
                    break;
                case 'colorname': 
                    c = colorNameToRgba(args);
                    break;
                default:
                    c = {r:0, g:0, b:0, a:0};
            }

        }
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        this.a = c.a;
    }
    hsla() 
    {  
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) h = s = 0; // achromatic
        else
        {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max)
            {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {h:Math.round(360*h), s:Math.round(s*100), l:Math.round(l*100), a:this.a};
    }
    hsva() 
    {
        const max = Math.max(this.r, this.g, this.b);
        const min = Math.min(this.r, this.g, this.b);

        let h;
        if (max === min) h = 0;
        else if (max === this.r) h = ( 60 * (this.g - this.b) / (max - min) + 360 ) % 360;
        else if (max === this.g) h = 60 * (this.b - this.r) / (max - min) + 120;
        else if (max === this.b) h = 60 * (this.r - this.g) / (max - min) + 240;

        let s;
        if (max === 0) s = 0;
        else s = (1 - min / max) * 100;

        let v = (max / 255) * 100;

        return {h:Math.round(h), s:Math.round(s), v:Math.round(v), a:this.a};
    }
    hex() 
    {
        return '#' + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1);
    }
    rgbaString() 
    {
        return 'rgba('+Math.floor(this.r)+','+Math.floor(this.g)+','+Math.floor(this.b)+','+this.a+')';
    }
    hslaString() 
    {
        const o = this.hsla();
        return 'hsla('+Math.floor(o.h)+','+Math.floor(o.s)+','+Math.floor(o.l)+','+o.a+')';
    }
    hsvaString() 
    {
        const o = this.hsva();
        return 'hsva('+Math.floor(o.h)+','+Math.floor(o.s)+','+Math.floor(o.v)+','+o.a+')';
    }
};

// List of valid color names.
const colorNames = 
{
    'aliceblue':'#f0f8ff','antiquewhite':'#faebd7','aqua':'#00ffff','aquamarine':'#7fffd4','azure':'#f0ffff',
    'beige':'#f5f5dc','bisque':'#ffe4c4','black':'#000000','blanchedalmond':'#ffebcd','blue':'#0000ff','blueviolet':'#8a2be2','brown':'#a52a2a','burlywood':'#deb887',
    'cadetblue':'#5f9ea0','chartreuse':'#7fff00','chocolate':'#d2691e','coral':'#ff7f50','cornflowerblue':'#6495ed','cornsilk':'#fff8dc','crimson':'#dc143c','cyan':'#00ffff',
    'darkblue':'#00008b','darkcyan':'#008b8b','darkgoldenrod':'#b8860b','darkgray':'#a9a9a9','darkgreen':'#006400','darkkhaki':'#bdb76b','darkmagenta':'#8b008b','darkolivegreen':'#556b2f',
    'darkorange':'#ff8c00','darkorchid':'#9932cc','darkred':'#8b0000','darksalmon':'#e9967a','darkseagreen':'#8fbc8f','darkslateblue':'#483d8b','darkslategray':'#2f4f4f','darkturquoise':'#00ced1',
    'darkviolet':'#9400d3','deeppink':'#ff1493','deepskyblue':'#00bfff','dimgray':'#696969','dodgerblue':'#1e90ff',
    'firebrick':'#b22222','floralwhite':'#fffaf0','forestgreen':'#228b22','fuchsia':'#ff00ff',
    'gainsboro':'#dcdcdc','ghostwhite':'#f8f8ff','gold':'#ffd700','goldenrod':'#daa520','gray':'#808080','green':'#008000','greenyellow':'#adff2f',
    'honeydew':'#f0fff0','hotpink':'#ff69b4',
    'indianred ':'#cd5c5c','indigo':'#4b0082','ivory':'#fffff0','khaki':'#f0e68c',
    'lavender':'#e6e6fa','lavenderblush':'#fff0f5','lawngreen':'#7cfc00','lemonchiffon':'#fffacd','lightblue':'#add8e6','lightcoral':'#f08080','lightcyan':'#e0ffff','lightgoldenrodyellow':'#fafad2',
    'lightgrey':'#d3d3d3','lightgreen':'#90ee90','lightpink':'#ffb6c1','lightsalmon':'#ffa07a','lightseagreen':'#20b2aa','lightskyblue':'#87cefa','lightslategray':'#778899','lightsteelblue':'#b0c4de',
    'lightyellow':'#ffffe0','lime':'#00ff00','limegreen':'#32cd32','linen':'#faf0e6',
    'magenta':'#ff00ff','maroon':'#800000','mediumaquamarine':'#66cdaa','mediumblue':'#0000cd','mediumorchid':'#ba55d3','mediumpurple':'#9370d8','mediumseagreen':'#3cb371','mediumslateblue':'#7b68ee',
    'mediumspringgreen':'#00fa9a','mediumturquoise':'#48d1cc','mediumvioletred':'#c71585','midnightblue':'#191970','mintcream':'#f5fffa','mistyrose':'#ffe4e1','moccasin':'#ffe4b5',
    'navajowhite':'#ffdead','navy':'#000080',
    'oldlace':'#fdf5e6','olive':'#808000','olivedrab':'#6b8e23','orange':'#ffa500','orangered':'#ff4500','orchid':'#da70d6',
    'palegoldenrod':'#eee8aa','palegreen':'#98fb98','paleturquoise':'#afeeee','palevioletred':'#d87093','papayawhip':'#ffefd5','peachpuff':'#ffdab9','peru':'#cd853f','pink':'#ffc0cb','plum':'#dda0dd','powderblue':'#b0e0e6','purple':'#800080',
    'red':'#ff0000','rosybrown':'#bc8f8f','royalblue':'#4169e1',
    'saddlebrown':'#8b4513','salmon':'#fa8072','sandybrown':'#f4a460','seagreen':'#2e8b57','seashell':'#fff5ee','sienna':'#a0522d','silver':'#c0c0c0','skyblue':'#87ceeb','slateblue':'#6a5acd','slategray':'#708090','snow':'#fffafa','springgreen':'#00ff7f','steelblue':'#4682b4',
    'tan':'#d2b48c','teal':'#008080','thistle':'#d8bfd8','tomato':'#ff6347','turquoise':'#40e0d0',
    'violet':'#ee82ee',
    'wheat':'#f5deb3','white':'#ffffff','whitesmoke':'#f5f5f5',
    'yellow':'#ffff00','yellowgreen':'#9acd32'
};

const getColorType = c => 
{
    if (isRgbString(c)) return 'rgb';
    else if (isHslString(c)) return 'hsl';
    else if (isHsvString(c)) return 'hsv';
    else if (isHex(c)) return 'hex';     
    else if (isColorName(c)) return 'colorname'; 
}

/** 
 * Check if c is a valid rgb css string.
 *
 * @since 0.1.0
 * @param {string} c The rgb color string 'rgb(255, 255, 255)'.
 * @return {boolean} true, if c is an rgb color, otherwise false.
 */
const isRgbString = c => (c.indexOf('rgb') !== -1);

/** 
 * Check if c is a valid hsl css string.
 *
 * @since 0.1.0
 * @param {string} c The hsl color string 'hsl(255, 255, 255)'.
 * @return {boolean} true, if c is an hsl color, otherwise false.
 */
const isHslString = c => (c.indexOf('hsl') !== -1);

/** 
 * Check if c is a valid hsv css string.
 *
 * @since 0.1.0
 * @param {string} c The hsv color string 'hsv(255, 255, 255)'.
 * @return {boolean} true, if c is an hsv color, otherwise false.
 */
const isHsvString = c => (c.indexOf('hsv') !== -1);

/** 
 * Check if c is a valid hex css string.
 *
 * @since 0.1.0
 * @param {string} c The hexadecimal value.
 * @return {boolean} true, if c is a hexadecimal color, otherwise false.
 */
const isHex = c => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(c);

/** 
 * Check if c is a valid color name.
 *
 * @since 0.1.0
 * @param {string} c The color name.
 * @return {boolean} true, if c is a color name, otherwise false.
 */
const isColorName = c =>
{
    if (colorNames[c.toLowerCase()] !== undefined) return true;
    return false;
};

/** 
 * Get the components colors for an rgb(a) color string.
 *
 * @since 0.1.0
 * @param {string} rgba The rgb(a) color string 'rgba(255, 255, 255, 1)'.
 * @return {object} An object containing the component colors {r:255, g:255, b:255, a:1}.
 */
const rgbaStringToRgba = rgba =>
{
    const arr = rgba.match(/\d+/g);
    return {r: Math.floor(arr[0]),  g: Math.floor(arr[1]), b: Math.floor(arr[2]), a: ((arr.length > 3) ? parseFloat(arr[3]) : 1)};
};

/** 
 * Get the components values for an hsl(a) color string.
 *
 * @since 0.1.0
 * @param {string} hsla The hsl(a) color string 'hsla(255, 255, 255, 1)'.
 * @return {object} An object containing the component values {h:255, s:255, l:255, a:1}.
 */
const hslaStringToHsla = hsla =>
{
    const arr = hsla.match(/\d+/g);
    return {h: Math.floor(arr[0]),  s: Math.floor(arr[1]), l: Math.floor(arr[2]), a: ((arr.length > 3) ? parseFloat(arr[3]) : 1)};
};

/** 
 * Get the components values for an hsv(a) color string.
 *
 * @since 0.1.0
 * @param {string} hsva The hsv(a) color string 'hsva(255, 255, 255, 1)'.
 * @return {object} An object containing the component values {h:255, s:255, l:255, a:1}.
 */
const hsvaStringToHsva = hsva =>
{
    const arr = hsva.match(/\d+/g);
    return {h: Math.floor(arr[0]),  s: Math.floor(arr[1]), v: Math.floor(arr[2]), a: ((arr.length > 3) ? parseFloat(arr[3]) : 1)};
};

/** 
 * Converts hex to rgb.
 *
 * @since 0.1.0
 * @param {string} hex The hexadecimal value.
 * @return {object} An object containing the rgb color values {r:255, g:255, b:255}.
 */
const hexToRgba = hex =>
{
    // Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {r : parseInt(result[1], 16),  g : parseInt(result[2], 16), b : parseInt(result[3], 16), a:1} : null;
};

/**
 * Converts HSV to RGB.
 * 
 * @since 0.1.0
 * @param {number} h The hue component.
 * @param {number} s The saturation component.
 * @param {number} v The value component.
 * @param {number} a The alpha component.
 * @return {object} An object containing the component colors {r:255, g:255, b:255, a:1}.
 */
const hsvaToRgba = (h, s, v, a = 1) =>
{
    let hue = h;
    const sat = s / 100;
    const val = (v / 100) * 255;

    if (hue < 0) {hue += 360;}

    const hi = Math.floor(hue / 60) % 6;
    const f = hue / 60 - Math.floor(hue / 60);
    const p = val * (1 - sat);
    const q = val * (1 - f * sat);
    const t = val * (1 - (1 - f) * sat);
    let r, g, b;

    switch(hi) 
    {
        case 0: r = val; g = t; b = p; break;
        case 1: r = q; g = val; b = p; break;
        case 2: r = p; g = val; b = t; break;
        case 3: r = p; g = q; b = val; break;
        case 4: r = t; g = p; b = val; break;
        case 5: r = val; g = p; b = q; break;
        default:
    }
    
    return {r:Math.round(r), g:Math.round(g), b:Math.round(b), a:a};
};

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
const hslaToRgba = (h, s, l, a = 1) =>
{
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s == 0) r = g = b = l; // achromatic
    else
    {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return {r:Math.round(r * 255), g:Math.round(g * 255), b:Math.round(b * 255), a:a};
}
const hue2rgb = (p, q, t) =>
{
    if(t < 0) t += 1;
    if(t > 1) t -= 1;
    if(t < 1/6) return p + (q - p) * 6 * t;
    if(t < 1/2) return q;
    if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
};

/** 
 * Converts a color name to rgb.
 *
 * @since 0.1.0
 * @param {string} c The color name.
 * @return {object} An object containing the component colors {r:255, g:255, b:255}.
 */
const colorNameToRgba = c => 
{
    const hex = colorNames[c.toLowerCase()];
    const rgb = hexToRgba(hex);
    return rgb;
};

/** 
 * Returns a randomly generated color.
 * 
 * @since 0.1.0
 * @return {object} An object containing the rgba color values {r:255, g:255, b:255, a:1}.
 */
const randomColor = () =>
{
    return new Color({r:Math.round(Math.random() * 255), g:Math.round(Math.random() * 255), b:Math.round(Math.random() * 255), a:1});
};

/** 
 * Gets the color corresponding to the interpolation fraction.
 * 
 * @since 0.1.0
 * @param {Array} arrColors The array of colors.
 * @param {Number} f A fraction between 0 and 1 controlling the interpolation.
 * @return {object} An object containing the rgba color values {r:255, g:255, b:255, a:1}.
 */
const interpolateColor = function(color1, color2, f)
{
    if (f <= 0) return new Color(color1);
    else if (f >= 1) return new Color(color2);
    else
    {
        const c1 = new Color(color1);
        const c2 = new Color(color2);
        const r = c1.r + (f * (c2.r - c1.r));
        const g = c1.g + (f * (c2.g - c1.g));
        const b = c1.b + (f * (c2.b - c1.b));
        return new Color({r:r, g:g, b:b, a:1});
    }
};

export {randomColor, interpolateColor};