/*
weatherTypePredictor.js
23. February 2023

desides on basic weather type (sunny, raining, snowing) based on temperature and humidity

Author:
Nilusink
*/


const WeatherTypes = {
    Sun: require("../assets/sun.png"),
    Rain: require("../assets/heavy-rain.png"),
    Snow: require("../assets/snow.png"),
    Clouds: require("../assets/cloud.png")
}


export function weatherTypePredictor(temperature, humidity)
{
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
    return WeatherTypes.Sun;
}

