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

	svg_axis
		.append('text')
		.attr(
			'transform',
			`translate(${svg_axis.node().getBoundingClientRect().width / 2}, ${
				svg_axis.node().getBoundingClientRect().height
			})`
		)
		.attr('text-anchor', 'middle')
		.attr('font-size', '30px')
		.text(x_name);

	svg_axis
		.append('text')
		.attr(
			'transform',
			`translate( 20 , ${
				svg_axis.node().getBoundingClientRect().height / 2
			})rotate(-90)`
		)
		.attr('text-anchor', 'middle')
		.attr('font-size', '30px')
		.text(y_name);

	return svg_axis;
};

export default createAxis;
