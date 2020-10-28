import { mapService } from '/js/mapService.js'

console.log('Main!');
var gMap;
var gLocations =[]
var DATA_KEY_LOCATIONS ='dbLocations' 

mapService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    initMap()
        .then(() => {

            addMarker({ lat: 32.0749831, lng: 34.9120554 });
            addMapEventOnClick()
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
    console.log('place marker' ,posCoords)
     var lat = posCoords.lat;
     var lng = posCoords.lng;
     console.log('place marker' ,lat ,lng)
     var marker = new google.maps.Marker({
            id:makeId(),
            name:'name',
            lat:lat,
            lng:lng,
            weather:'weather',
            createdAt:'createdAt',
            updatedAt:'updatedAt'
         });
         //console.log(marker)   

     marker.addListener("click", markerClick);
     console.log(' marker' ,marker)
     gLocations.push(marker)
     //createLocation(marker,lat,lng)
     //saveLocations()
}

function createLocation(marker,lat,lng){
    console.log('place marker' ,marker)
    console.log('place marker', name,lat,lng,weather,createdAt, updatedAt)
    var location = {
        id:makeId(),
        name,
        lat:lat,
        lng:lng,
        weather,
        createdAt,
        updatedAt,

    }
}

function markerClick(event){
    console.log(event)
    //var posCoords = event.latLng.toJSON()
    //console.log(posCoords)
    //// var location = []
    //if (confirm('save location?')){
    //    console.log('map' , posCoords)
    //    var lat = posCoords.lat;
    //    var lng = posCoords.lng;
    //    let location={lat,lng}
//
    //    updateLocations(location)
    //    //renderLocations()
    //}             
}

document.querySelector('.btn').addEventListener('click', (ev) => {
    console.log('Aha!', ev.target);
    panTo(35.6895, 139.6917);
})



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

function saveLocations(){
    saveToStorage(DATA_KEY_LOCATIONS, gLocations);
}



