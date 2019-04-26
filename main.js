window.addEventListener('load', function(){
    // DOM selection
    var nameHolder = document.getElementById('name');
    var tempDeg = document.querySelector('.temp-deg');
    var tempDes = document.querySelector('.temp-des');
    var locationTimeZone = document.querySelector('.location-timezone');
    var tempSec = document.querySelector('.deg-u');

    // Weather attributes
    var long;
    var lat;

    // Handling the name displaying
    (function(){
        var name = (localStorage.getItem('weather-app-name')) ? localStorage.getItem('weather-app-name') : 'Click to set a name';
        nameHolder.textContent = "Hello, " + name + "!";
        
        // Setting the name in local strogae
        nameHolder.addEventListener('click', function(){
            var nameInput = prompt("Enter your name:");
            if(nameInput.trim() !== "") {
                localStorage.setItem('weather-app-name', nameInput);
                nameHolder.textContent = "Hello, " + nameInput + "!";
            }
        })
    }());

    // A function to get weather data from "https://api.darksky.net/"
    function getWeather(lat, long, cb){
        // Passing CORS from anywhere
        var proxy = 'http://cors-anywhere.herokuapp.com/';
        var api = proxy + 'https://api.darksky.net/forecast/4020bb2ea51d104f9d30795d59860244/' + lat + ',' + long;

        // Making a GET request
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200) {
                // Passing the fetched data to a callback
                cb(JSON.parse(xhttp.response));
            }
        };
        xhttp.open("GET", api, true);
        xhttp.send();
    }

    // Set an icon according to the weather
    function setIcon(icon, iconId){
        var skycons = new Skycons({"color": 'white'});
        skycons.set("icon1", Skycons[icon.replace(/-/g, "_").toUpperCase()]);
        skycons.play();
    }

    // Access the browser's geolocation to get the current client's location
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(position){
            long = position.coords.longitude;
            lat = position.coords.latitude;

            var res = getWeather(lat, long, function(data){
                // An object to hold the fetched data
                var weather = {
                    temperature_f: Math.round(data.currently.temperature),
                    temperature_c: Math.round((data.currently.temperature - 32) * (5 / 9)),
                    summary: data.currently.summary,
                    icon: data.currently.icon,
                    timezone: data.timezone
                }

                // Setting the DOM elements to the data
                tempDeg.textContent = weather.temperature_f;
                tempDes.textContent = weather.summary;
                locationTimeZone.textContent = weather.timezone;
                setIcon(weather.icon, document.getElementById('icon1'));

                // Triggering the F/C button to switch between the units
                tempSec.addEventListener('click', function(){
                    if(this.textContent === 'F'){
                        tempDeg.textContent = weather.temperature_c;
                        this.textContent = 'C';
                    }else {
                        tempDeg.textContent = weather.temperature_f;
                        this.textContent = 'F';
                    }
                });
            });
        });
    }
});