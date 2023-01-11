/*
requesters.js
10. January 2023

all the functions for requesting

Author:
Nilusink
*/
const base_url = 'http://home.nilus.ink/'


export function getWeatherStations(setter, options="") {
    fetch(base_url + 'simple/stations/' + options)
        .then(response => {
            return response.json();
        })
        .then(json => {
            setter(json);
        })
        .catch(error => {
            console.error(error);
        });
}


export function getWeatherData(setter, n=1, extraOptions="") {
    fetch(base_url + `simple/weather/?n_results=${n}&` + extraOptions)
        .then(response => {
            return response.json();
        })
        .then(json => {
            setter(json);
        })
        .catch(error => {
            console.error(error);
        });
}
