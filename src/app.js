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
} from 'd3';

let width = 1900;
let height = 900;
let margin = { top: 100, right: 100, bottom: 100, left: 100 };
let colors = ['#596F7E', '#168B98', '#ED5B67', '#fd8f24', '#919c4c'];
let minYear = min(data, (d) => d.year);
let maxYear = max(data, (d) => d.year);

const svg = select('#final')
	.append('svg')
	.attr('width', width)
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

const tooltipMouseOver = (d, i) => {
	let le = select('body');
	let div = le
		.append('g')
		.append('div')
		.attr('class', 'tooltip')
		.style('opacity', 0);
	div.html(`
	Country: </br>
	Population: </br>
	Life Expectance: </br>
	Infant Mortality Rate: </br>
	`);
};

const tooltipMouseOut = (d, i) => {};

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
						console.log(d.name);
						console.log(d.life_expectance);
						console.log(d.infant_mortality_rate);
						console.log(d.population);
					})
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
						console.log(d.name);
						console.log(d.life_expectance);
						console.log(d.infant_mortality_rate);
						console.log(d.population);
					}),
			(exit) =>
				exit.call((exit) =>
					exit.transition(t).attr('r', 0).style('fill-opacity', 0).remove()
				)
		);
	const tooltip = select('body').append('div').attr('class', 'tooltip');
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
	year_data.sort((a, b) => {
		return b.population - a.population;
	});
	createScatterplot(year_data);
	console.log(year_data);
	console.log(+this.value);
});
