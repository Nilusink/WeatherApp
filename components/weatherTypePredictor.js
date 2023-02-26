/*
weatherTypePredictor.js
23. February 2023

desides on basic weather type (sunny, raining, snowing) based on temperature and humidity

Author:
Nilusink
*/
const WeatherTypes = {
    Sun: require("../assets/sun.png"),
    Moon: require("../assets/night.png"),
    Rain: require("../assets/heavy-rain.png"),
    Snow: require("../assets/snow.png"),
    Clouds: require("../assets/cloud.png")
}


/**
 * predicts if it will rain / snow / be sunny / etc.
 * @param temperature current temperature in °C
 * @param humidity current humidity in %
 * @returns {*} WeatherType image
 */
export function weatherTypePredictor(temperature, humidity, measurementTime)
{
    // format to a javascript readable time format
    measurementTime = measurementTime.replace("-", "T").replace(".", "-").replace(".", "-");
    const now = new Date(measurementTime);

    if (humidity > 90)
    {
        if (temperature < 2)
        {
            return WeatherTypes.Snow;
        }
        else
        {
            return WeatherTypes.Rain;
        }
    }
    else if (humidity > 70)
    {
        return WeatherTypes.Clouds;
    }

    // return sun when day and moon when night
    const currHour = now.getUTCHours();

    if (19 < currHour || currHour < 6)
    {
        return WeatherTypes.Moon;
    }
    return WeatherTypes.Sun;
}


/**
 * get the current temperature trend
 * @param currentValue current temperature
 * @param recentValues last values (depending on how long the trend should go back)
 * @returns {boolean} true...Ascending, false...Descending
 */
export function getWeatherTrend(currentValue, recentValues)
{
    const recentAvg = recentValues.reduce((partialSum, a) => partialSum + a, 0) / recentValues.length;
    return currentValue > recentAvg;
}
