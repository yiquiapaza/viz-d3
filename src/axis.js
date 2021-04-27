import { select } from 'd3-selection';
import './constast';
import {
	BREAKPOINT_DESKTOP,
	BREAKPOINT_LATOP,
	BREAKPOINT_TABLET,
} from './constast';
import { utilScaleX, utilScaleY } from './util';

const createAxis = (id_name, x_name, y_name) => {
	let svg_axis = select(id_name).append('svg').attr('width', '100%');
	if (
		svg_axis.node().getBoundingClientRect().width <= BREAKPOINT_DESKTOP &&
		svg_axis.node().getBoundingClientRect().width >= BREAKPOINT_LATOP
	) {
		svg_axis.node().setAttribute('height', '700px');
	} else if (
		svg_axis.node().getBoundingClientRect().width <= BREAKPOINT_LATOP &&
		svg_axis.node().getBoundingClientRect().width >= BREAKPOINT_TABLET
	) {
		svg_axis.node().setAttribute('height', '500px');
	}
	svg_axis
		.append('g')
		.attr(
			'transform',
			`translate(60, 
				${svg_axis.node().getBoundingClientRect().height - 40} )`
		)
		.call(utilScaleX(0, 100, svg_axis.node().getBoundingClientRect().width));
	svg_axis
		.append('g')
		.attr('transform', `translate(60, 60)`)
		.call(utilScaleY(0, 100, svg_axis.node().getBoundingClientRect().height));
	return svg_axis;
};

export default createAxis;
