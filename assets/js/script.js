var apiKey = '8ddd94af0062c9e0bd0ba08b3a7a2ee5';
var searchFormEl = document.querySelector('#search-form');
var searchBtn = document.querySelector('#search');
var cityInput = document.querySelector('#search-input');
var resultText = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var fiveDayContentEl = document.querySelector('#fiveDay');
var pastCitiesEl = document.querySelector('#search-history');
if (localStorage.getItem('city') == null) {
	var cityObj = [];
} else {
	var cityObj = JSON.parse(localStorage.getItem('city'));
}
// var historyButtonsEl = document.querySelector('#city-his-btn');

var formSubmitHandler = function (event) {
	event.preventDefault();

	var city = cityInput.value.trim();

	if (city) {
		getCityWeather(city);
	} else {
		alert('Please enter a city name');
	}
};

var buttonClickHandler = function (event) {
	var city = event.target.innerHTML;
	if (city) {
		getCityWeather(city);
	} else {
		alert('Please enter a city name');
	}
};

function buildHistoryButtons() {
	for (var i = 0; i < cityObj.length; i++) {
		var cityName = cityObj[i].name;
		var cityEl = document.createElement('button');
		cityEl.classList =
			'list-item flex-row justify-space-between align-center';

		var titleEl = document.createElement('span');
		titleEl.textContent = cityName;

		cityEl.appendChild(titleEl);
		pastCitiesEl.appendChild(cityEl);
	}
}

function buildCurrentWeather(currentCityObj) {
	var date = currentCityObj.date;
	var weatherIcon = currentCityObj.weatherIcon;
	var temp = currentCityObj.temp;
	var wind = currentCityObj.wind;
	var humidity = currentCityObj.humidity;
	var weatherEl = document.createElement('div');
	weatherEl.classList =
		'today-weather list-item flex-row justify-space-between align-center';
	var dateEl = document.createElement('h3');
	dateEl.innerHTML = date;
	var weatherIcEl = document.createElement('img');
	weatherIcEl.src =
		'http://openweathermap.org/img/wn/' + weatherIcon + '.png';
	var tempEl = document.createElement('ul');
	tempEl.textContent = 'Temperature ' + temp + '°F';
	var windEl = document.createElement('ul');
	windEl.textContent = 'Wind Speed ' + wind + ' MPH';
	var humidityEl = document.createElement('ul');
	humidityEl.textContent = 'Humidity ' + humidity + '%';

	weatherEl.appendChild(dateEl);
	weatherEl.appendChild(weatherIcEl);
	weatherEl.appendChild(tempEl);
	weatherEl.appendChild(windEl);
	weatherEl.appendChild(humidityEl);
	resultContentEl.appendChild(weatherEl);
}

function fiveDaySummary(fiveDayArray) {
	var day1 = new Date(fiveDayArray[0].dt * 1000).toISOString().split('T')[0];
	var savedTemp = 0;
	var savedWind = 0;
	var savedHumid = 0;
	fiveDayObject = [];
	var savedDay = day1;
	for (i = 0; i < fiveDayArray.length; i++) {
		var currentDay = new Date(fiveDayArray[i].dt * 1000)
			.toISOString()
			.split('T')[0];
		var currentTemp = fiveDayArray[i].main.temp;
		var currentWind = fiveDayArray[i].wind.speed;
		var currentHumid = fiveDayArray[i].main.humidity;
		if (savedDay == currentDay && i < fiveDayArray.length - 1) {
			savedTemp += currentTemp;
			savedWind += currentWind;
			savedHumid += currentHumid;
		} else {
			savedTemp = savedTemp / 8;
			savedWind = savedWind / 8;
			savedHumid = savedHumid / 8;
			fiveDayObject.push({
				date: currentDay,
				weatherIcon: fiveDayArray[i].weather[0].icon,
				temp: savedTemp.toFixed(2),
				wind: savedWind.toFixed(2),
				humidity: savedHumid.toFixed(2),
			});
			savedDay = currentDay;
			savedTemp = 0;
			savedHumid = 0;
			savedWind = 0;
		}
	}
	for (i = 0; i < fiveDayObject.length; i++) {
		buildDailyWeather(fiveDayObject[i]);
	}
}

function buildDailyWeather(currentCityObj) {
	var date = currentCityObj.date;
	var weatherIcon = currentCityObj.weatherIcon;
	var temp = currentCityObj.temp;
	var wind = currentCityObj.wind;
	var humidity = currentCityObj.humidity;
	var weatherEl = document.createElement('div');
	weatherEl.classList =
		' forecast-card list-item flex-row justify-space-between align-center';

	var dateEl = document.createElement('h3');
	dateEl.innerHTML = date;
	var weatherIcEl = document.createElement('img');
	weatherIcEl.src =
		'http://openweathermap.org/img/wn/' + weatherIcon + '.png';
	var tempEl = document.createElement('ul');
	tempEl.textContent = 'Temperature ' + temp + '°F';
	var windEl = document.createElement('ul');
	windEl.textContent = 'Wind Speed ' + wind + ' MPH';
	var humidityEl = document.createElement('ul');
	humidityEl.textContent = 'Humidity ' + humidity + '%';

	weatherEl.appendChild(dateEl);
	weatherEl.appendChild(weatherIcEl);
	weatherEl.appendChild(tempEl);
	weatherEl.appendChild(windEl);
	weatherEl.appendChild(humidityEl);
	fiveDayContentEl.appendChild(weatherEl);
}

var getCityWeather = async function (city) {
	var queryURL =
		'http://api.openweathermap.org/data/2.5/weather?q=' +
		city +
		'&units=imperial&appid=' +
		apiKey;
	var displayCity = function (city) {
		if (city.length === 0) {
			resultText.textContent = '';
			resultContentEl.textContent = 'Nothing found, enter a City name.';
			return;
		}
		resultText.textContent = city.name;
		updateCityObj = {
			date: new Date().toISOString().split('T')[0],
			name: city.name,
			weatherIcon: city.weather[0].icon,
			lat: city.coord.lat,
			lon: city.coord.lon,
		};
		cityObj.push(updateCityObj);
		localStorage.setItem('city', JSON.stringify(cityObj));

		currentCityObj = {
			date: new Date().toISOString().split('T')[0],
			name: city.name,
			weatherIcon: city.weather[0].icon,
			temp: city.main.temp,
			wind: city.wind.speed,
			humidity: city.main.humidity,
		};
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
			displayCity(data);
		});
	buildCurrentWeather(currentCityObj);
	getFiveDayForecast(city);
};

//shows the 5 day forcast for the city with imperial units
var getFiveDayForecast = function (city) {
	var cityHistory = JSON.parse(localStorage.getItem('city'));
	cityHistoryData = cityHistory.filter(function (obj) {
		return obj.name == city;
	});
	var lat = cityHistoryData[0].lat;
	var lon = cityHistoryData[0].lon;
	var fiveDayqueryURL =
		'https://api.openweathermap.org/data/2.5/forecast?lat=' +
		lat +
		'&lon=' +
		lon +
		'&units=imperial&appid=' +
		apiKey;
	fetch(fiveDayqueryURL, {
		cache: 'reload',
	})
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			fiveDaySummary(data.list);
		});
};

buildHistoryButtons();
searchFormEl.addEventListener('submit', formSubmitHandler);
pastCitiesEl.addEventListener('click', buttonClickHandler);
