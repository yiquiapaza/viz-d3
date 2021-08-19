export const selectCountry = (data) => {
	console.log(data)
	fetch('http://192.168.0.104:3000/country', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		},
		body: JSON.stringify(data),
	})
		.then((res) => res.json)
		.then((data) => {
			console.log('Success: ', data);
		})
		.catch((error) => {
			console.log('Error', error);
		});
};
