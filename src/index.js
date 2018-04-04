import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as Color from './Color' ;
import Raster from './Raster';
import registerServiceWorker from './registerServiceWorker';

const c = 'aliceblue';
const isColor = Color.isColor(c);
const rgb = Color.toRgba(c);
const hex = Color.toHex(rgb);
console.log(`in Color:${c} > is Color:${isColor} > ${rgb} > ${hex}`);

let r = new Raster('test');
let n = r.describe();
console.log(`Raster:${n}`);


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
