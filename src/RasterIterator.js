// Make 2-dimensional array iterable.

// Generator version.
export default class RasterIterator
{
    constructor(arr)
    {
        this.arr = arr;
    }
    [Symbol.iterator] = function*() 
    {
        const nRows = this.arr.length;
        const nCols = this.arr[0].length;
        for (let row = 0; row < nRows; row++) 
        {
            for (let col = 0; col < nCols; col++) 
            {
                yield {row:row, col:col, value:this.arr[row][col]};
            }
        }
    }
}

// Iterator version.
/*export default class RasterIterator
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
            return {value: {row:this.row, col:this.col, value:this.arr[this.row][this.col]}};
    }
}*/