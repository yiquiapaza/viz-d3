import dataAlphabet from '../data/data.json';
import './style.css';
import {
	select,
	scaleLinear,
	max,
	scaleBand,
	axisLeft,
	axisBottom,
	format,
} from 'd3';

const dimension = document.querySelector('#dimension');
const augmented = document.querySelector('#augmented');

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
			console.log('error');
			throw new Error('Something went wrong');
		});
};

dimension.addEventListener('click', addDimesion);
//augmented.addEventListener('click', sendData);
augmented.addEventListener('click', sendData);

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
		.attr('r', yScale.bandwidth() / 6);
};
renderBarchart(dataAlphabet);
renderScatterplot(dataAlphabet);
