'use strict';

import { storage } from '/js/storage-service.js';

const STORAGE_KEY = 'weatherDB';
// var gWeather = [];




// console.log(gWeather);
// console.log(loadWeather('tel-aviv'));


function loadWeather(cityName) {

    // var weather = storage.loadFromStorage(STORAGE_KEY);
    // if (weather) {
    //     gWeather = weather;
    //     _saveToStorage();
    //     console.log('loading weather from local storage');
    //     return gWeather;
    // }
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=0581774118db611eb667beb10ab2fcdd`)
        .then(res => {
            // gWeather = res.data;
            // _saveToStorage();
            return res.data;
        })
}



function loadCoords(lat, lon) {
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0581774118db611eb667beb10ab2fcdd`)
        .then(res => {
            return res.data;
        })
}



function _saveToStorage() {
    storage.saveToStorage(STORAGE_KEY, gWeather);
}


export const weatherService = {
    loadWeather,
    loadCoords
}
import {weatherService} from '/js/weather-service.js';

// 0581774118db611eb667beb10ab2fcdd