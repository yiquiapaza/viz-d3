import { extentByPropperty, utilScaleLinear } from './util';

const scatterPlot = (
	obj_visualization,
	data,
	x_property_name,
	y_property_name
) => {
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
		.attr('transform', 'translate(60, 60)')
		.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.attr('fill-opacity', 0.75)
		.attr('fill', '#8e44ad')
		.attr('cx', (d, i) => xPosition(d['Energy Consumption'][i]))
		.attr('cy', (d, i) => yPosition(d['GDP Per Capita'][i]))
		.attr('r', '10');
};

export default scatterPlot;
