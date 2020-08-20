import dataAlphabet from '../data/data.json';
import newData from '../data/newData.json';
import './style.css';
import {
	select,
	scaleLinear,
	max,
	scaleBand,
	axisLeft,
	axisBottom,
	format,
	min,
	scaleOrdinal,
	map,
	scaleLog,
	extent,
	scaleSqrt,
} from 'd3';

const dimension_chartbar = document.querySelector('#dimension-chartbar');
const augmented_chartbar = document.querySelector('#augmented-chartbar');

const addDimesion = () => {
	dataAlphabet.map((item) => {
		item.time = Math.random() * 100;
	});
};

const sendData = () => {
	fetch('http://localhost:3030/data-json', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(dataAlphabet),
	})
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			console.log(error);
			throw new Error('Something went wrong');
		});
};

dimension_chartbar.addEventListener('click', addDimesion);
//augmented.addEventListener('click', sendData);
augmented_chartbar.addEventListener('click', sendData);

const barchart = select('#barchar')
	.append('svg')
	.attr('width', 1200)
	.attr('height', 900);

const scatterplot = select('#scatterplot')
	.append('svg')
	.attr('width', 1200)
	.attr('height', 900);

const width = +barchart.attr('width');
const height = +barchart.attr('height');

const renderBarchart = (data) => {
	const xValue = (d) => d.value;
	const yValue = (d) => d.name;
	const margin = { top: 80, right: 80, bottom: 80, left: 80 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const xScale = scaleLinear()
		.domain([0, max(data, (d) => xValue(d)) * 10000])
		.range([0, innerWidth]);

	const yScale = scaleBand()
		.domain(data.map((d) => yValue(d)))
		.range([0, innerHeight])
		.padding(0.1);

	const g = barchart
		.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);

	g.append('g').call(axisLeft(yScale));
	g.append('g')
		.call(axisBottom(xScale))
		.attr('transform', `translate(0, ${innerHeight})`);

	g.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr('y', (d) => yScale(yValue(d)))
		.attr('width', (d) => xScale(xValue(d)) * 10000)
		.attr('height', yScale.bandwidth());
};

const renderScatterplot = (data) => {
	const xValue = (d) => d.value;
	const yValue = (d) => d.name;

	const margin = { top: 80, right: 80, bottom: 80, left: 80 };
	const innerWidth = width - margin.left - margin.right;
	const innerHeight = height - margin.top - margin.bottom;

	const xScale = scaleLinear()
		.domain([0, max(data, (d) => xValue(d))])
		.range([0, innerWidth]);

	const yScale = scaleBand()
		.domain(data.map((d) => yValue(d)))
		.range([0, innerHeight])
		.padding(0.1);

	const g = scatterplot
		.append('g')
		.attr('transform', `translate(${margin.left}, ${margin.top})`);

	const xAxisTickFormat = (number) => {
		format('.3s')(number).replace('G', 'B');
	};

	const xAxis = axisBottom(xScale).tickSize(-innerHeight).tickPadding(15);

	const yAxis = axisLeft(yScale).tickSize(-innerWidth).tickPadding(10);

	const yAxisG = g.append('g').call(yAxis);
	yAxisG.selectAll('.domain').remove();

	yAxisG
		.append('text')
		.attr('class', 'axis-label')
		.attr('y', -93)
		.attr('x', -innerHeight / 2)
		.attr('fill', 'black')
		.attr('transform', `rotate(-90)`)
		.attr('text-anchor', 'middle')
		.text('Cantidad');

	const xAxisG = g
		.append('g')
		.call(xAxis)
		.attr('transform', `translate(0, ${innerHeight})`);

	xAxisG.select('.domain').remove();
	g.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('cy', (d) => yScale(yValue(d)) + yScale.bandwidth() / 2)
		.attr('cx', (d) => xScale(xValue(d)))
		.attr('r', yScale.bandwidth() / 6)
		.on('click', click);
	function click(d) {
		console.log(d); //considering dot has a title attribute
	}
};

let final_width = 1200;
let final_height = 900;

let final_margin = {
	top: 80,
	right: 80,
	bottom: 80,
	left: 80,
};

let colors = ['#596F7E', '#168B98', '#ED5B67', '#fd8f24', '#919c4c'];

let minYear = min(newData, (d) => d.year);
let maxYear = max(newData, (d) => d.year);

let colorScale = scaleOrdinal()
	.domain(map(newData, (d) => d.region).keys())
	.range(colors);

const final_visualization = select('#final')
	.append('svg')
	.attr('width', final_width)
	.attr('height', final_height);

final_visualization.append('g');

let xScale = scaleLog()
	.domain(extent(newData, (d) => d.life_expectance))
	.nice()
	.range([final_margin.left, final_width - final_margin.right]);

let yScale = scaleLog()
	.domain(extent(newData, (d) => d.infant_mortality_rate))
	.nice()
	.range([final_height - final_margin.bottom, final_margin.top]);

let aScale = scaleSqrt()
	.domain(extent(newData, (d) => d.population))
	.range([0, 30]);

let xAxis = (g) =>
	g
		.attr('transform', `translate(0, ${final_height - final_margin.bottom})`)
		.call(axisBottom(xScale))
		.call((g) => g.select('.domain').remove());

let yAxis = (g) =>
	g
		.attr('transform', `translate(${final_margin.left}, 0)`)
		.call(axisLeft(yScale))
		.call((g) => g.select('.domain').remove());

const t = final_visualization.transition().duration(1000);

const out = final_visualization.select('g');

out
	.selectAll('circle')
	.data(newData, (d) => d.name)
	.join(
		(enter) =>
			enter
				.append('circle')
				.attr('class', 'bubble')
				.attr('id', (d, i) => 'point-' + i)
				.attr('fill-opacity', 0)
				.attr('fill', (d) => colorScale(d.region))
				.attr('cx', final_width / 2 - final_margin.left)
				.attr('cy', final_height / 2 - final_margin.bottom)
				.attr('r', 0)
				.call((enter) =>
					enter
						.transition(t)
						.attr('fill-opacity', 0.75)
						.attr('cx', (d) => xScale(d.life_expectance))
						.attr('cy', (d) => yScale(d.infant_mortality_rate))
						.attr('r', (d) => aScale(d.population))
				),
		(update) =>
			update.call((update) =>
				update
					.transition(t)
					.attr('cx', (d) => xScale(d.life_expectance))
					.attr('cy', (d) => yScale(d.infant_mortality_rate))
					.attr('r', (d) => aScale(d.population))
			),
		(exit) =>
			exit.call((exit) =>
				exit.transition(t).attr('r', 0).style('fill-opacity', 0).remove()
			)
	);

final_visualization
	.append('text')
	.attr(
		'transform',
		'translate(' + final_width / 2 + ',' + (final_height - 20) + ')'
	)
	.style('text-anchor', 'middle')
	.style('font-size', '20px')
	.text('Life Expectance Both');

final_visualization.append('g').call(xAxis);
final_visualization.append('g').call(yAxis);
renderBarchart(dataAlphabet);
renderScatterplot(dataAlphabet);
