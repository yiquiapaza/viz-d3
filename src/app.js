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
	keys,
} from 'd3';

let width = 1200;
let height = 800;
let margin = { top: 100, right: 100, bottom: 100, left: 100 };
let colors = ['#596F7E', '#168B98', '#ED5B67', '#fd8f24', '#919c4c'];
let minYear = min(data, (d) => d.year);
let maxYear = max(data, (d) => d.year);

const svg = select('#final')
	.append('svg')
	.attr('width', width)
	.attr('height', height)
	.style('fill', '#F5F5F2');

const t = svg.transition().duration(2000);
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
	.range([0, 20]);

svg.append('g').call(xAxis);
svg.append('g').call(yAxis);

const createScatterplot = (_data) => {
	svg
		.selectAll('circle')
		.data(_data)
		.join(
			(enter) =>
				enter
					.append('circle')
					.attr('class', 'bubble')
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

	console.log('se ejecuto');
};

let year_data = data.filter((obj) => {
	return obj.year === 1950;
});

createScatterplot(year_data);
select('#year').on('input', function () {
	let year_data = data.filter((obj) => {
		return obj.year === +this.value;
	});

	svg.enter();
	createScatterplot(year_data);
	console.log(year_data);
	console.log(+this.value);
});
