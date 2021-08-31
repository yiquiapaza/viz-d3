const updateBar = () =>{
	let element = document.getElementById('#myProgress');
	let width = 0;
	var identity = setInterval(scene, 10)
	function scene() {
		if (width >= 100) {
			clearInterval(identity);
		} else {
			width++; 
			element.style.width = width + '%'; 
		}
	}
};

