import { extentByPropperty, utilScaleLinear } from './util';
import { selectCountry } from './services';
import { transition } from 'd3';

let status_country = { name: '', status: 0 };

const changeStatus = (state) => {
	return state == 1 ? 0 : 1;
}

const scatterPlot = (
	obj_visualization,
	data,
	x_property_name,
	y_property_name
) => {
	let t = 5000;
	let svg_scatter_plot = obj_visualization;
	let xPosition = utilScaleLinear(
		extentByPropperty(data, x_property_name)[0],
		extentByPropperty(data, x_property_name)[1],
		svg_scatter_plot.node().getBoundingClientRect().width - 100
	);
	let yPosition = utilScaleLinear(
		extentByPropperty(data, y_property_name)[1],
		extentByPropperty(data, y_property_name)[0],
		svg_scatter_plot.node().getBoundingClientRect().height
	);
	svg_scatter_plot
		.append('g')
		.selectAll('circle')
		.data(data)
		.attr('transform', 'translate(60, 60)')
		.join(
			(enter) => 
				enter.append('circle')
				.attr('transform', 'translate(60, 60)')
				.attr('fill-opacity', 0.75)
				.attr('fill', '#8e44ad')
				.attr('cx', (d, i) => xPosition(d['Energy Consumption'][i]))
				.attr('cy', (d, i) => yPosition(d['GDP Per Capita'][i]))
				.attr('r', '10')
				.on('click', (d, i) => {
					status_country.name = d['name'];
					status_country.status = changeStatus(status_country.status);
					selectCountry(status_country);
				})
				.call(enter => 
					enter.transition(t)
					.attr('cx', (d, i) => xPosition(d['Energy Consumption'][i]))
					.attr('cy', (d, i) => yPosition(d['GDP Per Capita'][i]))
				),
			(update) => 
				update.call(update => 
					update.transition(t)
					.attr('cx', (d, i) => xPosition(d['Energy Consumption'][i]))
					.attr('cy', (d, i) => yPosition(d['GDP Per Capita'][i]))),
			(exit) => 
				exit.call(exit => 
					exit.transition(t).attr('r', 0).style('fill-opacity', 0).remove())
		);
};

export default scatterPlot;
