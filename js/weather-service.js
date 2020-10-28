'use strict';


loadWeather()

function loadWeather(){
    return axios.get('http://api.openweathermap.org/data/2.5/forecast?id=0581774118db611eb667beb10ab2fcdd')
    .then(res => {
        console.log(res.data);
    })
}