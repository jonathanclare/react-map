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

		if (this.nRows !== undefined && this.nCols !== undefined && values.length > 0)
		{
    		let arrRaster = [];
	        let index = -1;
	        for (let row = 0; row < this.nRows; row++) 
	        {
	            arrRaster.push([]);
	            for (let col = 0; col < this.nCols; col++) 
	            {
	                arrRaster[i][j] = values[index++];
	            }
	        }
    		this.raster = new Iterable(values);
		}

        if (this.west !== undefined && this.xRes !== undefined) this.east =  this.west + (this.xRes * this.nCols);
        if (this.south !== undefined && this.yRes !== undefined) this.north = this.south + (this.yRes * this.nRows);
    }
}

// Make 2-dimensional array iterable.
// Generator version.
class Iterable
{
    constructor(arr)
    {
        this.arr = [...arr];
    }
    [Symbol.iterator] = function*() 
    {
        const nRows = this.arr.length;
        const nCols = this.arr[0].length;
        for (let row = 0; row < nRows; row++) 
        {
            for (let col = 0; col < nCols; col++) 
            {
                yield this.arr[row][col];
            }
        }
    }
}
// Iterator version.
/*class Iterable
{
    constructor(arr)
    {
        this.arr = [...arr];
        this.row = 0;
        this.col = -1;
        this.nRows = this.arr.length;
        this.nCols = this.arr[0].length;
    }
    [Symbol.iterator]() 
    {
        return this;
    }
    next() 
    {
        this.col++;
        if (this.col >= this.nCols) 
        {
            this.row++;
            this.col = 0;
        }

        if (this.row >=  this.nRows)  
            return {done: true};
        else
            return {value: this.arr[this.row][this.col]};
    }
}*/