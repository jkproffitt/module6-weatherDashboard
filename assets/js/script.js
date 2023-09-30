var apiKey = '8ddd94af0062c9e0bd0ba08b3a7a2ee5';
var city = '';
function search() {
	city = document.getElementById('search-input').value;
	console.log(city);
	callFetch(city);
}
// var searchBtn = document.querySelector('#search');
function callFetch(city) {
	console.log('yo');
	var queryURL =
		'http://api.openweathermap.org/data/2.5/weather?q=' +
		city +
		'&appid=' +
		apiKey;
	fetch(queryURL, {
		// The browser fetches the resource from the remote server without first looking in the cache.
		// The browser will then update the cache with the downloaded resource.
		cache: 'reload',
	})
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log(data);
			cityObj = {
				name: data.name,
				lat: data.coord.lat,
				lon: data.coord.lon,
			};
			localStorage.setItem('city', JSON.stringify(cityObj));
		});
	var cityHistory = JSON.parse(localStorage.getItem('city'));
	var lat = cityHistory.lat;
	var lon = cityHistory.lon;
	var fiveDayqueryURL =
		'https://api.openweathermap.org/data/2.5/forecast?lat=' +
		lat +
		'&lon=' +
		lon +
		'&appid=' +
		apiKey;

	fetch(fiveDayqueryURL, {
		// The browser fetches the resource from the remote server without first looking in the cache.
		// The browser will then update the cache with the downloaded resource.
		cache: 'reload',
	})
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log(data);
		});
}
