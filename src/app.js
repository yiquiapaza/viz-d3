import dataAlphabet from '../data/data.json';
import './style.css';
import {
	select,
	scaleLinear,
	max,
	scaleBand,
	axisLeft,
	axisBottom,
	svg,
} from 'd3';

const barchart = select('#barchar')
	.append('svg')
	.attr('width', 960)
	.attr('height', 600);

const scatterplot = select('#scatterplot')
	.append('svg')
	.attr('width', 960)
	.attr('height', 600);

const width = +barchart.attr('width');
const height = +barchart.attr('height');

const renderBarchart = (data) => {
	const xValue = (d) => d.value;
	const yValue = (d) => d.name;
	const margin = { top: 20, right: 20, bottom: 20, left: 20 };
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

	const margin = { top: 20, right: 20, bottom: 20, left: 20 };
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

	g.append('g').call(axisLeft(yScale));
	g.append('g')
		.call(axisBottom(xScale))
		.attr('transform', `translate(0, ${innerHeight})`);

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
