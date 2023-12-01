/*
requesters.js
10. January 2023

all the functions for requesting

Author:
Nilusink
*/
const base_url = 'http://home.nilus.ink:43210/'


/**
 * get all available stations
 * @param setter setter for value return
 * @param options extra parameter specification
 */
export function getWeatherStations(setter, options="")
{
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


/**
 * get weather data
 * @param setter setter for value return
 * @param n how many results
 * @param extraOptions extra parameter specifications
 */
export function getWeatherData(setter, n=1, extraOptions="")
{
    const url = base_url + `simple/weather/?n_results=${n}&` + extraOptions;
    fetch(url)
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
