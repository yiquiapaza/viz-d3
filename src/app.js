import './style.css';
import data from '../data/first_expriment.json';
import { createScatterPlot } from './visualizations';

createScatterPlot(
	'#scatter--plot--visualization',
	data,
	'Energy Consumption',
	'GDP Per Capita'
);
