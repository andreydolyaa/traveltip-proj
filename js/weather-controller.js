'use strict';

import { weatherService } from '/js/weather-service.js';

onInit();

function onInit() {
    var weather = weatherService.loadWeather('tel-aviv')
    weather.then(res => {
        return renderWeather(res);
    });
}


function renderWeather(res) {
    // var elIcon = `http://openweathermap.org/img/wn/10d@2x.png`
    document.querySelector('.loading').style.display = 'none';
    var elWeather = document.querySelector('.weather-container');
    elWeather.innerHTML = `
    <div><img src="http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png"></div>
    <h2>${res.name}, ${res.sys.country}, ${res.weather[0].description}</h2>
    <h1><span>${res.main.temp.toFixed(1)}c</span></h1>
    <p>temperature from ${res.main.temp_min} to ${res.main.temp_max}c, wind ${res.wind.speed} m/s </p> 
    `;
}