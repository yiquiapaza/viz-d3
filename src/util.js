import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';

export const utilScaleY = (max_y, min_y, height) => {
	let yscale = axisLeft(
		scaleLinear()
			.domain([min_y, max_y])
			.nice()
			.range([0, height - 100])
	);
	return yscale;
};

export const utilScaleX = (min_x, max_x, width) => {
	let xscale = axisBottom(
		scaleLinear()
			.domain([min_x, max_x])
			.nice()
			.range([0, width - 100])
	);
	return xscale;
};
