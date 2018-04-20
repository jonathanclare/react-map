export default class RasterRenderer
{
    constructor(raster) 
    {
        this.raster = raster;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
    }
    getDataUrl(colorTable, opacity = 1) 
    {
        return new Promise((resolve, reject) => 
        {
            this.canvas.width = this.raster.nCols;
            this.canvas.height = this.raster.nRows;
            const imgData = this.context.createImageData(this.raster.nCols, this.raster.nRows);
            let index = 0;
            for (let cell of this.raster.cells)
            {
                const c = colorTable.getColorForValue(cell.value);
                imgData.data[index] = c.r; 
                imgData.data[index+1] = c.g;  
                imgData.data[index+2] = c.b;  
                imgData.data[index+3] = opacity * 255; 
                index += 4;
            }
            this.context.putImageData(imgData, 0, 0);
            resolve(this.canvas.toDataURL('image/png'));
        });
  	}
}