import { select } from 'd3-selection';
import createAxis from './axis';
import './style.css';
const svg_axis = createAxis('#scatter--plot--visualization');

console.log(svg_axis.node().getBoundingClientRect().height);
