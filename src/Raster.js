import RasterIterator from './RasterIterator';
export default class Raster 
{
    constructor({nRows, nCols, west, south, xRes, yRes, noDataValue, values = []} = {}) 
    {
    	this.nRows = nRows;
    	this.nCols = nCols;
    	this.west = west;
    	this.south = south;
    	this.xRes = xRes;
    	this.yRes = yRes;
    	this.noDataValue = noDataValue;
        this.values = [...values];

        if (this.nRows !== undefined && this.nCols !== undefined && this.values.length > 0)
		{
	        let index = 0;
            this.rast = [];
    		this.min = Infinity;
    		this.max = -Infinity;
	        for (let row = 0; row < this.nRows; row++) 
	        {
	            this.rast.push([]);
	            for (let col = 0; col < this.nCols; col++) 
	            {
	            	const value = this.values[index];
	                this.rast[row][col] = value;
		    		this.min = Math.min(this.min, value);
		    		this.max = Math.max(this.max, value);
	                index++;
	            }
	        }
    		this.range = this.max - this.min;
		}
        this.cells =  new RasterIterator(this.rast);

        if (this.west !== undefined && this.xRes !== undefined) this.east =  this.west + (this.xRes * this.nCols);
        if (this.south !== undefined && this.yRes !== undefined) this.north = this.south + (this.yRes * this.nRows);
    }
    clone()
    { 
        return new Raster({nRows:this.nRows, nCols:this.nCols, west:this.west, south:this.south, xRes:this.xRes, yRes:this.yRes, noDataValue:this.noDataValue, values:this.values});
    }
    get3x3MatrixAt(col, row)
    { 
        const a = this.getValueAt(col-1, row-1);
        const b = this.getValueAt(col, row-1);
        const c = this.getValueAt(col+1, row-1);
        const d = this.getValueAt(col-1, row);
        const e = this.getValueAt(col, row);
        const f = this.getValueAt(col+1, row);
        const g = this.getValueAt(col-1, row+1);
        const h = this.getValueAt(col, row+1);
        const i = this.getValueAt(col+1, row+1);
        return {a:a, b:b, c:c, d:d, e:e, f:f, g:g, h:h, i:i};
    }
    getValueAt(col, row)
    { 
        if (row < 0 || row > this.rast.length-1) return this.noDataValue;
        else if (col < 0 || col > this.rast[row].length-1) return this.noDataValue;
        return this.rast[row][col];
    }
    setValueAt(col, row, value)
    { 
        if (row >= 0 && row < this.rast.length && col >= 0 && col < this.rast[row].length)
        this.rast[row][col] = value;
    }
}
