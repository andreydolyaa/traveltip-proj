'use strict';

const STORAGE_KEY = 'weatherDB';
var gWeather;



loadWeather();


function loadWeather() {
    var weather = loadFromStorage(STORAGE_KEY);
    if (weather && weather.length) {
        gWeather = weather;
        _saveToStorage();
        console.log('loading weather from local storage');
        return gWeather;
    }
    return axios.get('http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=0581774118db611eb667beb10ab2fcdd')
        .then(res => {
            console.log(res.data.list);
            gWeather = res.data.list;
            _saveToStorage();
            console.log('loading weather from server');
            return res.data.list;
        })
}




function _saveToStorage() {
    saveToStorage(STORAGE_KEY, gWeather);
}