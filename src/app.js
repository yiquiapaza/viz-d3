import './style.css';
import data from '../data/first_expriment.json';
import { createScatterPlot } from './visualizations';

let button = document.getElementById('button');
button.onclick = () => {
	let temp = 0;
	setInterval(() => {
		if(temp > 24){
			temp = 0;
			document.getElementById('myBar').style.width = '0%';
		}
		else{
			document.getElementById('myBar').style.width = (temp * 4) +'%';
			console.log(temp);
			temp++;
		}
		}, 500);
}


createScatterPlot(
	'#scatter--plot--visualization',
	data,
	'Energy Consumption',
	'GDP Per Capita'
);
