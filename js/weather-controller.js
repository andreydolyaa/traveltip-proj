'use strict';

import { weatherService } from '/js/weather-service.js';
import {mapControler} from '/js/mapController.js';

onInit();

function onInit() {
    onGetCity();
}



function renderWeather(res) {
    // document.querySelector('.loading').style.display = 'none';
    var elWeather = document.querySelector('.weather-container');
    elWeather.innerHTML = `
    <div><img src="http://openweathermap.org/img/wn/${res.weather[0].icon}@2x.png"></div>
    <h2>${res.name}, ${res.sys.country}, ${res.weather[0].description}</h2>
    <h1><span>${res.main.temp.toFixed(1)}c</span></h1>
    <p>temperature from ${res.main.temp_min} to ${res.main.temp_max}c, wind ${res.wind.speed} m/s </p> 
    `;
}



function onGetCity() {
    var input = document.querySelector('.input');
    var btn = document.querySelector('.input-location button');
    btn.addEventListener('click', function () {
        var weather = weatherService.loadWeather(`${input.value}`)
        weather.then(res => {
            mapControler.showLocationFromInput(res);
            return renderWeather(res);
        });
    })
}


