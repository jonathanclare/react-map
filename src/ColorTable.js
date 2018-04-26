import {interpolateColor, toRgba} from './Color' ;
export default class ColorTable
{
    constructor(arrColorRules = []) 
    {
        this.arrColorRules = [...arrColorRules];
    }
    addColorRule(arrColors = [], min, max) 
    {
        this.arrColorRules.push({colors:arrColors, min:min, max:max});
    }
    getColorForValue(value) 
    {
        let cr;
        for (let [index, colorRule] of this.arrColorRules.entries())
        {
            if ((index === 0) && (value >= colorRule.min) && (value <= colorRule.max))
            {
                cr = colorRule;
                break;
            }
            else if ((value > colorRule.min) && (value <= colorRule.max))
            {
                    cr = colorRule;
                    break;
            }
        }
        if (cr !== undefined)
        {
            const f = (value - cr.min) / (cr.max - cr.min);
            const c = getColorAtPosition(cr, f);
            return c;
        }
        return null;
    }
};

const getColorAtPosition = (colorRule, f) =>
{
    if (colorRule.colors.length === 1) return toRgba(colorRule.colors[0]);
    else if (colorRule.colors.length === 2) return interpolateColor(colorRule.colors[0], colorRule.colors[1], f);
    else
    {
        const fSize = 1 / (colorRule.colors.length - 1);
        const lowerIndex = Math.floor(f / fSize);
        const upperIndex = lowerIndex + 1;
        const f2 = (f % fSize) / ((fSize * upperIndex) - (fSize * lowerIndex));
        return interpolateColor(colorRule.colors[lowerIndex], colorRule.colors[upperIndex], f2);
    }
};  