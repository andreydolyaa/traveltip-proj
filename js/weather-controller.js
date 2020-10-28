'use strict';

import {weatherService} from '/js/weather-service.js';

// onInit();

function onInit(){
    var weather = weatherService.loadWeather('tel-aviv')
    weather.then(res => {
        return renderWeather(res)
    })
}


function renderWeather(res){
    document.querySelector('.weather-container p').innerHTML = res.main.temp
    document.querySelector('.weather-container h1').innerHTML = res.name
}