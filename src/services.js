export const selectCountry = (state) => {
	fetch('http://192.168.0.104:3000/state', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify({ state: state }),
	})
		.then((res) => res.json)
		.then((data) => {
			console.log('Success: ', data);
		})
		.catch((error) => {
			console.log('Error', error);
		});
};
