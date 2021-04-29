import axis from './axis';
import scatterPlot from './scatterplot';
import { selectTmp } from './util';

export const createScatterPlot = (
	id_visualzation,
	data,
	x_property_name,
	y_property_name
) => {
	let visualization = selectTmp(id_visualzation);
	axis(x_property_name, y_property_name, visualization, data);
	scatterPlot(visualization, data, x_property_name, y_property_name);
};
