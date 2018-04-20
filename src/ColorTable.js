import {getColorAt} from './Color' ;
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
            if (index === 0)
            {
                if ((value >= colorRule.min) && (value <= colorRule.max))
                {
                    cr = colorRule;
                    break;
                }
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
            const c = getColorAt(cr.colors, f);
            return c;
        }
        return null;
    }
}