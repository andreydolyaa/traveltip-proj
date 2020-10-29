import { mapService } from '/js/mapService.js'
import { UTIL } from '/js/util-service.js'
import { storage } from '/js/storage-service.js'
import {weatherService} from '/js/weather-service.js';

export const mapControler = {showLocationFromInput}


console.log('Main!');
var gMap;
var gLocations;
var DATA_KEY_LOCATIONS ='dbLocations' 


function renderLocations(){
    var locations = storage.loadFromStorage(DATA_KEY_LOCATIONS)
    console.log('render gLocations',locations)
    var el = document.querySelector('.locations')
    //console.log('render gLocations' ,locations)
    if (!locations || !locations.length) {  
        //console.log('no locations')     
        el.innerHTML = 'no locations'
        return
        
    }
    //gLocations = []
    gLocations = locations;
    //console.log('render gLocations',gLocations)  
    var strHTML = gLocations.map((locationItem,index, array) => { 
        console.log('locationItem',locationItem)       
       return `<div class="locationContainer"><div class="location" data-locid="${index}">
       <span class="item">${locationItem.lat}</span>
       <span class="item">${locationItem.lng}</span>
       <span class="item">${locationItem.name}</span>
       <span class="item">${locationItem.createdAt}</span>
       <button data-locid="${index}" class="deleteLocation"> delete </button>
      
       </div></div>`;
      }); 
    //console.log('strHTML' ,strHTML);
    el.innerHTML = strHTML.join('');
    
}

function setMarkers(){
    var locations = storage.loadFromStorage(DATA_KEY_LOCATIONS)
    if (!locations || !locations.length) return;
    gLocations.forEach((position) =>{
        console.log('value',position)
        var lat = position.lat;
        var lng = position.lng;
        var marker;
        var map = gMap;
        marker = new google.maps.Marker({
            position: { lat, lng },
            map,
            title: 'Hello World!',
        });
    })
}

document.querySelector('.btn').addEventListener('click', (ev) => {
    console.log('Aha!', ev.target);
    navigator.geolocation.getCurrentPosition(showLocation, handleLocationError);
    console.log(navigator)

})
//fixed
export function showLocationFromInput(res){
    console.log('event showLocation', res); 
    //console.log(event.coords.latitude); 
    //console.log(event.coords.longitude);
    var lat = res.coord.lat;
    var lng = res.coord.lon; 
    panTo(lat, lng);
    placeMarkerMyLocation(lat, lng);
} 

function showLocation(event){
    //console.log('event showLocation', event); 
    //console.log(event.coords.latitude); 
    //console.log(event.coords.longitude);
    var lat = event.coords.latitude;
    var lng = event.coords.longitude; 
    panTo(lat, lng);
    placeMarkerMyLocation(lat, lng);
} 


function placeMarkerMyLocation(mylat, mylng) { 
    console.log('place marker' ,mylat, mylng)
     var lat = mylat;
     var lng = mylng;

     console.log('place marker' ,lat,lng )
     var marker = new google.maps.Marker({
            position: { lat:lat, lng:lng },
            map: gMap,
         });
         //console.log(marker)   
     marker.addListener("click", markerClick);
     
     var id  = UTIL.makeId(4);
     //var markerDetails = 
    
        //console.log('markerDetails User position is:',  markerDetails);  
     var createMarker = _createMarker(lat,lng,id,marker)
     
     //console.log(' marker' ,marker)
     if (!gLocations || !gLocations.length) gLocations = [];
     gLocations.push(createMarker)
     console.log(gLocations);
     saveLocations()
     renderLocations();
}

function addEventToLocations(){
    var elsLocation = document.querySelectorAll('.location');
    console.log(elsLocation)
    elsLocation.forEach(elLocation =>{
        elLocation.addEventListener("click", event => {
            selectLocation(event)
        });
    });
}

function selectLocation(event){
    //console.log(event,gLocations ,gLocations[0], gLocations[0].lat , gLocations[0].lng)
    var index = Number(event.target.dataset.locid)
    //console.log(typeof index ,index)

    var pos = {
      lat:gLocations[index].lat,
      lng:gLocations[index].lng,
    }
    //console.log(pos)
    gMap.setCenter(pos);
}

function addEventToDeleteLocation(){
    var elsLocation = document.querySelectorAll('.deleteLocation');
    console.log(elsLocation)
    elsLocation.forEach(elLocation =>{
        elLocation.addEventListener("click", event => {
            console.log('elsLocation',elsLocation)
            deleteLocation(event)
        });
    });
}

function deleteLocation(event){
    console.log(event)
    var index = Number(event.target.dataset.locid)
    //console.log(typeof index ,index)

    gLocations.splice(index,1);

    saveLocations();   
    renderLocations();
    //console.log(pos)

}


mapService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
            addMapEventOnClick()
            renderLocations()
            setMarkers()
            addEventToLocations()
            addEventToDeleteLocation()
        })
        .catch(console.log('INIT MAP ERROR'));

    getPosition()
        .then(pos => {

        console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })

}

function addMapEventOnClick(){
    gMap.addListener("click", (mapsMouseEvent) => {
        // Close the current InfoWindow.       
        console.log('click',mapsMouseEvent)      
        placeMarker(mapsMouseEvent)
    });
}

function placeMarker(mapsMouseEvent) { 
    var posCoords = mapsMouseEvent.latLng.toJSON()
    //console.log('place marker' ,posCoords)
     var lat = posCoords.lat;
     var lng = posCoords.lng;

     //console.log('place marker' ,lat,lng )
     var marker = new google.maps.Marker({
            position: { lat:lat, lng:lng },
            map: gMap,
         });
         //console.log(marker)   
     marker.addListener("click", markerClick);

     var createMarker;
     weatherService.loadCoords(lat, lng).then(res => {
        var id  = UTIL.makeId(4);
        var name = res.name + res.sys.country;
        var weather = res.weather
        //console.log(' marker' ,country ,name, weather)
        createMarker = _createMarker(lat,lng,id,name,weather)
        console.log('res',res)
        console.log('createMarker',createMarker)
        if (!gLocations || !gLocations.length) gLocations = []
        gLocations.push(createMarker)
        console.log(gLocations);
        console.log('gLocations' , gLocations)
        saveLocations()
        renderLocations();
    })  

}

function _createMarker(lat,lng,id,name,weather){
        console.log(lat,lng,id,name,weather)
        var marker ={
            lat:lat,
            lng:lng,
            id:id,
            name:name,
            weather:weather,
            createdAt:UTIL.getDateAndTime(),
            updatedAt:'updatedAt',
        }
        return marker;
}

function markerClick(event){
    console.log('markerClick',event)
    //var posCoords = event.latLng.toJSON()
    //console.log(posCoords)
    //// var location = []   
}



export function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function getPosition() {
    console.log('Getting Pos');

    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyCy6hOuYH-4WoOK2wfJ14CVE1U8HW6Dp70'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}



// show user position
function getUserPosition() {
    if (!navigator.geolocation) return alert("HTML5 Geolocation is not supported in your browser.");

    // One shot position getting or continus watch
    navigator.geolocation.getCurrentPosition(showLocation, handleLocationError);
    // navigator.geolocation.watchPosdeleteLocationition(showLocation, handleLocationError);
}

function handleLocationError(error) {
    var locationError = document.getElementById("locationError");

    switch (error.code) {
        case 0:
            locationError.innerHTML = "There was an error while retrieving your location: " + error.message;
            break;
        case 1:
            locationError.innerHTML = "The user didn't allow this page to retrieve a location.";
            break;
        case 2:
            locationError.innerHTML = "The browser was unable to determine your location: " + error.message;
            break;
        case 3:
            locationError.innerHTML = "The browser timed out before retrieving the location.";
            break;
    }
}


function saveLocations(){
    storage.saveToStorage(DATA_KEY_LOCATIONS, gLocations);
    console.log('save',gLocations)
    window.locations = gLocations; //debug
}



