const style = () => {
	let body = document.querySelector('body');
	body.style.margin = '0px';

	let header = document.querySelector('#header');
	header.style.padding = '60px';
	header.style.textAlign = 'center';
	header.style.background = '#1abc9c';
	header.style.color = 'white';
	header.style.fontSize = '30px';
	header.style.fontFamily = 'Arial';
	header.style.position = 'sticky';
};

export default style;
