import { max, min } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import {
	BREAKPOINT_DESKTOP,
	BREAKPOINT_LATOP,
	BREAKPOINT_TABLET,
} from './constast';

export const utilScaleY = (max_y, min_y, height) => {
	let yscale = axisLeft(utilScaleLinear(min_y, max_y, height));
	return yscale;
};

export const utilScaleX = (min_x, max_x, width) => {
	let xscale = axisBottom(utilScaleLinear(min_x, max_x, width));
	return xscale;
};

export const selectTmp = (id_name) => {
	let svg_axis = select(id_name).append('svg').attr('width', '100%');
	if (
		svg_axis.node().getBoundingClientRect().width <= BREAKPOINT_DESKTOP &&
		svg_axis.node().getBoundingClientRect().width >= BREAKPOINT_LATOP
	) {
		svg_axis.node().setAttribute('height', '800px');
	} else if (
		svg_axis.node().getBoundingClientRect().width <= BREAKPOINT_LATOP &&
		svg_axis.node().getBoundingClientRect().width >= BREAKPOINT_TABLET
	) {
		svg_axis.node().setAttribute('height', '600px');
	}
	return svg_axis;
};

export const utilScaleLinear = (min, max, lenght) => {
	return scaleLinear()
		.domain([min, max])
		.range([0, lenght - 100]);
};

export const extentByPropperty = (data, property_name) => {
	let tmp_array = [];
	for (let item of data) {
		tmp_array.push(...item[property_name]);
	}
	return [min(tmp_array), max(tmp_array)];
};
