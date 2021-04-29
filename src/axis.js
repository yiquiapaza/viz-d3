import { extentByPropperty, utilScaleX, utilScaleY } from './util';

const axis = (x_name, y_name, obj_visualization, data) => {
	let svg_axis = obj_visualization;
	svg_axis
		.append('g')
		.attr(
			'transform',
			`translate(60, 
				${svg_axis.node().getBoundingClientRect().height - 40} )`
		)
		.call(
			utilScaleX(
				extentByPropperty(data, x_name)[0],
				extentByPropperty(data, x_name)[1],
				svg_axis.node().getBoundingClientRect().width
			)
		);
	svg_axis
		.append('g')
		.attr('transform', `translate(60, 60)`)
		.call(
			utilScaleY(
				extentByPropperty(data, y_name)[0],
				extentByPropperty(data, y_name)[1],
				svg_axis.node().getBoundingClientRect().height
			)
		);

	svg_axis
		.append('text')
		.attr(
			'transform',
			`translate(${svg_axis.node().getBoundingClientRect().width / 2}, ${
				svg_axis.node().getBoundingClientRect().height
			})`
		)
		.attr('text-anchor', 'middle')
		.attr('font-size', '20px')
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
		.attr('font-size', '20px')
		.text(y_name);
};

export default axis;
