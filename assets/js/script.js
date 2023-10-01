var apiKey = '8ddd94af0062c9e0bd0ba08b3a7a2ee5';
var searchFormEl = document.querySelector('#search-form');
var searchBtn = document.querySelector('#search');
var cityInput = document.querySelector('#search-input');
var resultText = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
if (localStorage.getItem('city') == null) {
	var cityObj = [];
} else {
	var cityObj = JSON.parse(localStorage.getItem('city'));
}
// var historyButtonsEl = document.querySelector('#city-his-btn');

var formSubmitHandler = function (event) {
	event.preventDefault();

	var city = cityInput.value.trim();
	console.log(city);

	if (city) {
		getCityWeather(city);
	} else {
		alert('Please enter a city name');
	}
};

var buttonClickHandler = function (event) {
	//TODO:  var city = event.target.getAttribute('data-language');
	// if (city) {
	// 	getCityWeather(city);
	// } else {
	// 	alert('Please enter a city name');
	// }
};

var getCityWeather = async function (city) {
	var queryURL =
		'http://api.openweathermap.org/data/2.5/weather?q=' +
		city +
		'&appid=' +
		apiKey;
	var displayCity = function (city) {
		if (city.length === 0) {
			resultText.textContent = '';
			resultContentEl.textContent = 'Nothing found, enter a City name.';
			return;
		}
		resultText.textContent = city.name;
		updateCityObj = {
			name: city.name,
			lat: city.coord.lat,
			lon: city.coord.lon,
		};
		console.log(updateCityObj);
		cityObj.push(updateCityObj);
		localStorage.setItem('city', JSON.stringify(cityObj));
	};
	await fetch(queryURL, {
		// The browser fetches the resource from the remote server without first looking in the cache.
		// The browser will then update the cache with the downloaded resource.
		cache: 'reload',
	})
		.then(function (response) {
			if (response.ok) {
				return response.json();
			} else {
				alert('Error: ' + response.statusText);
			}
		})
		.then(function (data) {
			console.log(data);
			displayCity(data);
		});
	getFiveDayForecast(city);
};
var getFiveDayForecast = function (city) {
	console.log(city);
	var cityHistory = JSON.parse(localStorage.getItem('city'));
	console.log(cityHistory);
	cityHistoryData = cityHistory.filter(function (obj) {
		return obj.name == city;
	});
	console.log(cityHistoryData);
	var lat = cityHistoryData[0].lat;
	var lon = cityHistoryData[0].lon;
	var fiveDayqueryURL =
		'https://api.openweathermap.org/data/2.5/forecast?lat=' +
		lat +
		'&lon=' +
		lon +
		'&appid=' +
		apiKey;
	fetch(fiveDayqueryURL, {
		cache: 'reload',
	})
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			console.log(data);
		});
};

searchFormEl.addEventListener('submit', formSubmitHandler);
// historyButtonsEl.addEventListener('click', buttonClickHandler);
