import RasterIterator from './RasterIterator';
export default class Raster 
{
    constructor({nRows, nCols, west, south, xRes, yRes, noDataValue, values = [], raster} = {}) 
    {
        if (raster !== undefined)
        {
            this.nRows = raster.nRows;
            this.nCols = raster.nCols;
            this.xRes = raster.xRes;
            this.yRes = raster.yRes;
            this.west = raster.west;
            this.south = raster.south;
            this.east =  raster.east;
            this.north = raster.north;
            this.noDataValue = raster.noDataValue;
            this.min = raster.min;
            this.max = raster.max;
            this.range = raster.range;
            this.rast = [];
            for (let row = 0; row < this.nRows; row++) 
            {
                this.rast.push([]);
                for (let col = 0; col < this.nCols; col++) 
                {
                    this.rast[row][col] = raster.rast[row][col];
                }
            }
            this.cells = new RasterIterator(raster.rast);
        }
        else
        {
            this.nRows = nRows;
            this.nCols = nCols;
            this.west = west;
            this.south = south;
            this.xRes = xRes;
            this.yRes = yRes;
            this.east =  this.west + (this.xRes * this.nCols);
            this.north = this.south + (this.yRes * this.nRows);
            this.noDataValue = noDataValue;
            this.rast = [];

            if (values.length > 0)
            {
                let index = 0;
                this.min = Infinity;
                this.max = -Infinity;
                for (let row = 0; row < this.nRows; row++) 
                {
                    this.rast.push([]);
                    for (let col = 0; col < this.nCols; col++) 
                    {
                        const value = values[index];
                        this.rast[row][col] = value;
                        this.min = Math.min(this.min, value);
                        this.max = Math.max(this.max, value);
                        index++;
                    }
                }
                this.range = this.max - this.min;
            }
            else // Empty raster.
            {
                for (let row = 0; row < this.nRows; row++) 
                {
                    this.rast.push([]);
                    for (let col = 0; col < this.nCols; col++) 
                    {
                        this.rast[row][col] = this.noDataValue;
                    }
                }
            }

            this.cells =  new RasterIterator(this.rast);
        }
    }
    clone()
    { 
        return new Raster({raster:this});
    }
    cloneEmpty()
    { 
        return new Raster({nRows:this.nRows, nCols:this.nCols, west:this.west, south:this.south, xRes:this.xRes, yRes:this.yRes, noDataValue:this.noDataValue});
    }
    trim(nCells = 1)
    { 
        // Remove rows.
        for (let n = 0; n < nCells; n++) 
        {
            this.rast.shift();
            this.rast.pop();
        }

        // Remove cols.
        this.nRows = this.nRows - (nCells * 2);
        this.nCols = this.nCols - (nCells * 2);
        for (let row = 0; row < this.nRows; row++) 
        {
            this.rast[row].shift();
            this.rast[row].pop();
        }

        // Re-calculate min, max and range.
        this.min = Infinity;
        this.max = -Infinity;
        for (let cell of this.cells)
        {
            this.min = Math.min(this.min, cell.value);
            this.max = Math.max(this.max, cell.value);
        }
        this.range = this.max - this.min;

        // Re-calculate bounds.
        this.west = this.west + (this.xRes * nCells);
        this.south = this.south + (this.yRes * nCells);
        this.east =  this.west + (this.xRes * this.nCols);
        this.north = this.south + (this.yRes * this.nRows);
        this.cells =  new RasterIterator(this.rast);
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
        if (a === undefined || b === undefined || c === undefined ||
            d === undefined || e === undefined || f === undefined ||
            g === undefined || h === undefined || i === undefined) return undefined
        else return {a:a, b:b, c:c, d:d, e:e, f:f, g:g, h:h, i:i};
    }
    getValueAt(col, row)
    { 
        if (row >= 0 && row < this.rast.length && col >= 0 && col < this.rast[row].length) return this.rast[row][col];
        else return undefined;
    }
    setValueAt(col, row, value)
    { 
        if (row >= 0 && row < this.rast.length && col >= 0 && col < this.rast[row].length) this.rast[row][col] = value;
    }
}
