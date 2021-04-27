import createAxis from './axis';
import './style.css';
import data from '../data/first_expriment.json';

const svg_axis = createAxis(
	'#scatter--plot--visualization',
	'test axis x',
	'test axis y'
);

console.log(data[0]['Energy Consumption'][0]);
console.log(svg_axis.node().getBoundingClientRect().height);
