import dataAlphabet from '../data/data.json';
import { select, scaleLinear, max, scaleBand, axisLeft, axisBottom } from 'd3';

const svg = select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const render = (data) => {
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
		.range([0, innerHeight]);

	const g = svg
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

render(dataAlphabet);
