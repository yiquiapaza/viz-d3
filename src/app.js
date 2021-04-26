import data from '../data/newData.json';
import './style.css';
import {
	select,
	max,
	min,
	extent,
	axisBottom,
	axisLeft,
	scaleSqrt,
	scaleLinear,
	event,
	selectAll,
} from 'd3';

import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
	withCredentials: true,
});

socket.on('connect', () => {
	console.log(socket.id);
});

let width = 1900;
let height = 900;
let margin = { top: 100, right: 100, bottom: 100, left: 100 };

let minYear = min(data, (d) => d.year);
let maxYear = max(data, (d) => d.year);

let maxPopulation = max(data, (d) => d.population);
console.log(maxPopulation);
let maxLifeExpectance = max(data, (d) => d.life_expectance);
console.log(maxLifeExpectance);
let maxInfantMortalityRate = max(data, (d) => d.infant_mortality_rate);
console.log(maxInfantMortalityRate);

let x_axis = document.getElementById('x-axis');
let y_axis = document.getElementById('y-axis');

let title_axis = document.getElementById('title-axies');

x_axis.onclick = () => {
	title_axis.innerText = 'X: ' + x_axis.value + ' and ' + 'Y: ' + y_axis.value;
};

y_axis.onclick = () => {
	title_axis.innerText = 'X: ' + x_axis.value + ' and ' + 'Y: ' + y_axis.value;
};

let send_data = document.getElementById('send-data');
send_data.onclick = () => {
	fetch('http://192.168.0.30:3000/axis', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		mode: 'cors',
		body: JSON.stringify({ x: x_axis, y: y_axis }),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log('Success: ', data);
		})
		.catch((error) => {
			console.error('Error', error);
		});
};

const svg = select('#final')
	.append('svg')
	.attr('width', '100%')
	.attr('height', height);

const t = svg.transition().duration(3000);
//const circle = svg;

const xScale = scaleLinear()
	.domain(extent(data, (d) => d.life_expectance))
	.nice()
	.range([margin.left, width - margin.right]);

const yScale = scaleLinear()
	.domain(extent(data, (d) => d.infant_mortality_rate))
	.nice()
	.range([height - margin.bottom, margin.top]);

const xAxis = (g) =>
	g
		.attr('transform', `translate(0, ${height - margin.bottom})`)
		.call(axisBottom(xScale))
		.call((g) => g.select('.domain').remove());

let yAxis = (g) =>
	g
		.attr('transform', `translate(${margin.left}, 0)`)
		.call(axisLeft(yScale))
		.call((g) => g.select('.domain').remove());

let aScale = scaleSqrt()
	.domain([0, max(data, (d) => d.population)])
	.range([0, 70]);

svg.append('g').call(xAxis);
svg.append('g').call(yAxis);

svg
	.append('text')
	.attr('class', 'text')
	.attr('transform', `translate( ${width / 2} , ${height - 20})`)
	.attr('text-anchor', 'middle')
	.attr('font-size', '30px')
	.text('Life Expectance');

svg
	.append('text')
	.attr('class', 'text')
	.attr(
		'transform',
		`translate( ${margin.left / 4} , ${height / 2})rotate(-90)`
	)
	.attr('text-anchor', 'middle')
	.attr('font-size', '30px')
	.text('Infant Mortality Rate');

svg
	.append('g')
	.attr('class', 'grid')
	.attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
	.attr('stroke-opacity', 0.5)
	.call(
		axisBottom(xScale)
			.ticks(8)
			.tickSize(-height + margin.top + margin.bottom)
			.tickFormat('')
	);
svg
	.append('g')
	.attr('class', 'grid')
	.attr('transform', 'translate(' + margin.left + ',0)')
	.attr('stroke-opacity', 0.5)
	.call(
		axisLeft(yScale)
			.ticks(8)
			.tickSize(-width + margin.left + margin.right)
			.tickFormat('')
	);

let names = [
	'Asia',
	'Europe',
	'Africa',
	'Middle East',
	'North America',
	'Oceania',
	'South America',
];
let color = new Map();
color.set('Asia', '#f39c12');
color.set('Europe', '#8e44ad');
color.set('Africa', '#2980b9');
color.set('Middle East', '#34495e');
color.set('North America', '#5dade2');
color.set('Oceania', '#e74c3c');
color.set('South America', '#2ecc71');
svg
	.selectAll('legend_dots')
	.data(names)
	.enter()
	.append('rect')
	.attr('x', '86%')
	.attr('y', (d, i) => {
		return 100 + i * 20;
	})
	.attr('width', 20)
	.attr('height', 20)
	.attr('fill', (d) => {
		return color.get(d);
	});

svg
	.selectAll('legend_labels')
	.data(names)
	.enter()
	.append('text')
	.attr('x', '87.5%')
	.attr('y', (d, i) => {
		return 115 + i * 20;
	})
	.text((d) => {
		return d;
	})
	.attr('width', 20)
	.attr('height', 20)
	.attr('fill', (d) => color.get(d));

const tooltipMouseOver = (d, i) => {
	let le = select('body');
	let div = le.append('div').attr('class', 'tooltip').style('opacity', 0);
	div
		.html(
			`
	Country: ${d.name} </br>
	Population: ${d.population}</br>
	Life Expectance: ${d.life_expectance}</br>
	Infant Mortality Rate: ${d.infant_mortality_rate}</br>
	`
		)
		.style('opacity', 1)
		.style('left', event.pageX + 28 + 'px')
		.style('top', event.pageY + 28 + 'px');

	let le2 = selectAll('circle#point-' + i);
	le2
		.transition()
		.duration(100)
		.style('fill-opacity', 0.9)
		.style('stroke', 'black')
		.style('stroke-width', '1px')
		.style('stroke-opacity', 0.7);
};

const tooltipMouseOut = (d, i) => {
	let el = select('.tooltip');
	el.remove();
	let el2 = selectAll('circle#point-' + i);

	el2
		.transition()
		.duration(100)
		.style('fill-opacity', 0.75)
		.style('stroke-width', '0px');
};

let sendYear = (year) => {
	fetch('http://localhost:3000/year', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ year: +year }),
	})
		.then((response) => response.json)
		.then((data) => {
			console.log('Success: ', data);
		})
		.catch((error) => {
			console.error('Error', error);
		});
};

let sendData = (country_code) => {
	fetch('http://localhost:3000/data', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ country_code: +country_code }),
	})
		.then((response) => response.json)
		.then((data) => {
			console.log('Success:', data);
		})
		.catch((error) => {
			console.error(error);
		});
};

const createScatterplot = (_data) => {
	svg
		.selectAll('circle')
		.data(_data)
		.join(
			(enter) =>
				enter
					.append('circle')
					.attr('fill-opacity', 0)
					.attr('fill', (d) => d.color)
					.attr('id', (d, i) => 'point-' + i)
					.attr('cx', width / 2 - margin.left)
					.attr('cy', height / 2 - margin.bottom)
					.attr('r', 0)
					.on('click', (d) => {
						sendData(d.country_code);
					})
					.on('mouseover', (d, i) => tooltipMouseOver(d, i))
					.on('mouseout', (d, i) => tooltipMouseOut(d, i))
					.call((enter) =>
						enter
							.transition(t)
							.attr('fill-opacity', 0.75)
							.attr('fill', (d) => d.color)
							.attr('cx', (d) => xScale(d.life_expectance))
							.attr('cy', (d) => yScale(d.infant_mortality_rate))
							.attr('r', (d) => aScale(d.population))
					),
			(update) =>
				update
					.call((update) => update.transition(t))
					.attr('fill', (d) => d.color)
					.attr('cx', (d) => xScale(d.life_expectance))
					.attr('cy', (d) => yScale(d.infant_mortality_rate))
					.attr('r', (d) => aScale(d.population))
					.on('click', (d) => {
						sendData(d.country_code);
					})
					.on('mouseover', (d, i) => tooltipMouseOver(d, i))
					.on('mouseout', (d, i) => tooltipMouseOut(d, i)),
			(exit) =>
				exit.call((exit) =>
					exit.transition(t).attr('r', 0).style('fill-opacity', 0).remove()
				)
		);

	console.log('se ejecuto');
};

let year_data = data.filter((obj) => {
	return obj.year === 1950;
});
year_data.sort((a, b) => {
	return b.population - a.population;
});

createScatterplot(year_data);
select('#year').on('input', function () {
	let year_data = data.filter((obj) => {
		return obj.year === +this.value;
	});
	sendYear(this.value);
	year_data.sort((a, b) => {
		return b.population - a.population;
	});
	createScatterplot(year_data);
	console.log(year_data);
	console.log(+this.value);
});
