const getRateOfChange = (matrix, xRes, yRes) =>
{ 
	const dy = ((matrix.g + (2*matrix.h) + matrix.i) - (matrix.a + (2*matrix.b) + matrix.c)) / (8 * yRes);
	const dx = ((matrix.c + (2*matrix.f) + matrix.i) - (matrix.a + (2*matrix.d) + matrix.g)) / (8 * xRes);
	return {y:dy, x:dx};
};

const getSlope = (dy, dx) =>
{ 
	const riserun = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	const slopeRad = Math.atan(riserun);
	return slopeRad;
};

const getAspect = (dy, dx) =>
{ 
	let aspectRad = Math.atan2(dy, (-1 * dx));
	if (dx !== 0 && aspectRad < 0) aspectRad = (2 * Math.PI) + aspectRad;
	else
	{
	    if (dy > 0) aspectRad = Math.PI / 2;
	    else if (dy < 0)  aspectRad = (2 * Math.PI) - (Math.PI / 2);
	}
	return aspectRad;
};

const getHillshade = (dy, dx, altitudeDeg = 45, azimuthDeg = 315) =>
{ 
	let azimuthMath = 360 - azimuthDeg + 90;
	if (azimuthMath >= 360) azimuthMath = azimuthMath - 360;
	const azimuthRad = azimuthMath * (Math.PI / 180);   
	const zenithDeg = 90 - altitudeDeg;
	const zenithRad = zenithDeg * (Math.PI / 180);  
	const aspectRad = getAspect(dy, dx);
	const slopeRad = getSlope(dy, dx);
	let hillshade = 255 * ((Math.cos(zenithRad) * Math.cos(slopeRad)) + (Math.sin(zenithRad) * Math.sin(slopeRad) * Math.cos(azimuthRad - aspectRad)));
	if (hillshade < 0) hillshade = 0;
	return hillshade;
};

const slope = raster =>
{ 
	const outRaster = raster.clone();
    for (let cell of raster.cells)
    {
    	const matrix = raster.get3x3MatrixAt(cell.col, cell.row);
    	const change = getRateOfChange(matrix, raster.xRes, raster.yRes);
		const slopeRad = getSlope(change.y, change.x);
		outRaster.setValueAt(cell.col, cell.row, slopeRad);
    }
    return outRaster;
};

const aspect = raster =>
{ 
	const outRaster = raster.clone();
    for (let cell of raster.cells)
    {
    	const matrix = raster.get3x3MatrixAt(cell.col, cell.row);
    	const change = getRateOfChange(matrix, raster.xRes, raster.yRes);
		const aspectRad = getAspect(change.y, change.x);
		outRaster.setValueAt(cell.col, cell.row, aspectRad);
    }
    return outRaster;
};

const hillshade = (raster, altitudeDeg = 45, azimuthDeg = 315) =>
{  
	const outRaster = raster.clone();
    for (let cell of raster.cells)
    {
    	const matrix = raster.get3x3MatrixAt(cell.col, cell.row);
    	const change = getRateOfChange(matrix, raster.xRes, raster.yRes);
		const shade = getHillshade(change.y, change.x, altitudeDeg, azimuthDeg);
		outRaster.setValueAt(cell.col, cell.row, shade);
    }
    return outRaster;
};

export {slope, aspect, hillshade, getRateOfChange, getSlope, getAspect, getHillshade};