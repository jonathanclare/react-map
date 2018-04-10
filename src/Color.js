/**
 * @fileoverview    Contains color functions.
 * @author          Jonathan Clare 
 * @copyright       Jonathan Clare 2018
 * @module          Color 
 */

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

/** 
 * Check if c is a valid rgb color.
 *
 * @since 0.1.0
 * @param {string} c The rgb color string 'rgb(255, 255, 255)'.
 * @return {boolean} true, if c is an rgb color, otherwise false.
 */
const isRgb = c =>  (c.indexOf('rgb') !== -1);

/** 
 * Check if c is a valid rgba color.
 *
 * @since 0.1.0
 * @param {string} c The rgb(a) color string 'rgba(255, 255, 255, 1)'.
 * @return {boolean} true, if c is an rgba color, otherwise false.
 */
const isRgba = c => (c.indexOf('rgba') !== -1);


/** 
 * Check if c is a valid hex color.
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
 * Check if c is a valid color.
 *
 * @since 0.1.0
 * @param {string} c The color.
 * @return {boolean} true, if c is a valid css color, otherwise false.
 */
const isCssColor = c =>
{
    if (isHex(c) || isRgb(c) || isColorName(c)) return true;
    return false;
};

/** 
 * Check if c is a valid rgba object.
 *
 * @since 0.1.0
 * @param {object} c An object containing the component colors {r:255, g:255, b:255}.
 * @return {boolean} true, if c is an rgba object, otherwise false.
 */
const isRgbaObject = c => 
{
    if (c.hasOwnProperty('r') && c.hasOwnProperty('g') && c.hasOwnProperty('b')) return true; 
    return false;
};

/** 
 * Check if c is a valid hsv color.
 *
 * @since 0.1.0
 * @param {string} c The color.
 * @return {boolean} true, if c is a hsv object, otherwise false.
 */
const isHsvObject = c => 
{
    if (c.hasOwnProperty('h') && c.hasOwnProperty('s') && c.hasOwnProperty('v')) return true; 
    return false;
};

/** 
 * Converts rgb to hex.
 *
 * @since 0.1.0
 * @param {number} r The red component.
 * @param {number} g The green component.
 * @param {number} b The blue component.
 * @param {number} a The alpha component.
 * @return {string} The rgb(a) color string 'rgba(255, 255, 255, 1)'.
 */
const rgbaToRgbaString = (r, g, b, a = 1) => 'rgba('+Math.floor(r)+','+Math.floor(g)+','+Math.floor(b)+','+a+')'

/** 
 * Converts rgb to hex.
 *
 * @since 0.1.0
 * @param {number} r The red component.
 * @param {number} g The green component.
 * @param {number} b The blue component.
 * @return {string} The hexadecimal value.
 */
const rgbToHex = (r, g, b) => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

/** 
 * Converts rgb to hsv.
 *
 * @since 0.1.0
 * @param {number} r The red component.
 * @param {number} g The green component.
 * @param {number} b The blue component.
 * @return {object} An object containing the component colors {h:255, s:255, v:255}.
 */
const rgbToHsv = (r, g, b) => 
{
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h;
    if (max === min) h = 0;
    else if (max === r) h = ( 60 * (g - b) / (max - min) + 360 ) % 360;
    else if (max === g) h = 60 * (b - r) / (max - min) + 120;
    else if (max === b) h = 60 * (r - g) / (max - min) + 240;

    let s;
    if ( max === 0 ) s = 0;
    else s = (1 - min / max) * 100;

    let v = (max / 255) * 100;

    return {h:Math.round(h), s:Math.round(s), v:Math.round(v)};
}

/** 
 * Get the components colors for an rgba color string.
 *
 * @since 0.1.0
 * @param {string} rgba The rgb(a) color string 'rgba(255, 255, 255, 1)'.
 * @return {object} An object containing the component colors {r:255, g:255, b:255, a:1}.
 */
const rgbaStringToRgba = rgba =>
{
    const arr = rgba.match(/\d+/g);
    const o = {r: Math.floor(arr[0]),  g: Math.floor(arr[1]), b: Math.floor(arr[2]), a: ((arr.length > 3) ? arr[3] : 1)};
    return o;
};

/** 
 * Converts hex to rgb.
 *
 * @since 0.1.0
 * @param {string} hex The hexadecimal value.
 * @return {object} An object containing the rgb color values {r:255, g:255, b:255}.
 */
const hexToRgb = hex =>
{
    // Expand shorthand form (e.g. '03F') to full form (e.g. '0033FF')
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {r : parseInt(result[1], 16),  g : parseInt(result[2], 16), b : parseInt(result[3], 16)} : null;
};

/**
 * Converts HSV to RGB.
 * 
 * @since 0.1.0
 * @param {object} An object containing the component colors {h:255, s:255, v:255}.
 * @return {object} An object containing the component colors {r:255, g:255, b:255}.
 */
const hsvToRgb = hsv =>
{
    let h = hsv.h;
    const s = hsv.s / 100;
    const v = (hsv.v / 100) * 255;

    if (h < 0) {h += 360;}

    const hi = Math.floor( h / 60 ) % 6;
    const f = h / 60 - Math.floor( h / 60 );
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - ( 1 - f ) * s );
    let r, g, b;

    switch(hi) 
    {
        case 0: 
            r = v;
            g = t;
            b = p;
        break;
        case 1: 
            r = q;
            g = v;
            b = p;
        break;
        case 2: 
            r = p;
            g = v;
            b = t;
        break;
        case 3: 
            r = p;
            g = q;
            b = v;
        break;
        case 4: 
            r = t;
            g = p;
            b = v;
        break;
        case 5: 
            r = v;
            g = p;
            b = q;
        break;
    }
    
    return {r:r, g:g, b:b};
};

/** 
 * Converts a color name to rgb.
 *
 * @since 0.1.0
 * @param {string} c The color name.
 * @return {object} An object containing the component colors {r:255, g:255, b:255}.
 */
const colorNameToRgb = c => 
{
    const hex = colorNames[c.toLowerCase()];;
    const rgb = hexToRgb(hex);
    return rgb;
};

/**
 * Converts the color to rgb.
 * 
 * @since 0.1.0
 * @param {string} c The color.
 * @return {object} An object containing the rgba color values {r:255, g:255, b:255, a:1}.
 */
const toRgba = c => 
{
    if (isRgbaObject(c)) return c; 
    else if (isRgb(c)) return rgbaStringToRgba(c); 
    else if (isHex(c)) return hexToRgb(c);
    else if (isColorName(c)) return colorNameToRgb(c);
    else if (isHsvObject(c)) return hsvToRgb(c);
    return {r:0, g:0, b:0, a:1};
};

/**
 * Converts a color to an rgba string.
 *
 * @since 0.1.0
 * @param {string} c The color.
 * @return {string} An rgba color string 'rgba(255, 255, 255, 1)'.
 */
const toRgbaString = c =>
{
    const o = toRgba(c);
    return rgbaToRgbaString(o.r, o.g, o.b);
};

/**
 * Converts a color to an hex string.
 *
 * @since 0.1.0
 * @param {string} c The color.
 * @return {string} The hexadecimal value.
 */
const toHex = c =>
{
    const o = toRgba(c);
    return rgbToHex(o.r, o.g, o.b);
};

/**
 * Returns a color value with the given hue, saturation, value components.
 * 
 * @since 0.1.0
 * @param {string} c The color.
 * @return {object} An object containing the component colors {h:255, s:255, v:255}.
 */
const toHsv = c =>
{
    const o = toRgba(c);
    return rgbToHsv(o.r, o.g, o.b);
};

/**
 * Interpolate between two color values by the given mixing proportion.
 * A mixing fraction of 0 will result in c1, a value of 1.0 will result
 * in c2, and value of 0.5 will result in the color mid-way between the
 * two in RGB color space.
 * 
 * @since 0.1.0
 * @param {String} c1 The starting color.
 * @param {String} c2 The target color.
 * @param {Number} f A fraction between 0 and 1 controlling the interpolation.
 * @return {object} An object containing the rgba color values {r:255, g:255, b:255, a:1}.
 */
const getInterpolatedColor = (c1, c2, f) =>
{
    const o1 = toRgba(c1);
    const o2 = toRgba(c2);
    const r = o1.r + (f*(o2.r - o1.r));
    const g = o1.g + (f*(o2.g - o1.g));
    const b = o1.b + (f*(o2.b - o1.b));
    return {r:r, g:g, b:b, a:1};
};

/** 
 * Returns a randomly generated color.
 * 
 * @since 0.1.0
 * @return {object} An object containing the rgba color values {r:255, g:255, b:255, a:1}.
 */
const getRandomColor = function()
{
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);
    return {r:r, g:g, b:b, a:1};
};

export {isCssColor, toRgba, toRgbaString, toHex, toHsv, getInterpolatedColor, getRandomColor};