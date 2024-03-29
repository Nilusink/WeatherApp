/*
uiElements.js
10. January 2023

shared UI elements

Author:
Nilusink
*/
import {Dimensions, Image, Pressable, StyleSheet, Text, View} from "react-native";
import { mapValue } from "react-native-chart-kit/dist/Utils";
import { LineChart } from 'react-native-chart-kit';
import * as Progress from 'react-native-progress';
import { useEffect, useState } from "react";

import { weatherTypePredictor, getWeatherTrend } from "./weatherTypePredictor";
import { getFavourites, setFavourite } from "./storage";
import { getWeatherData } from "./requesters";


const DHT_MIN = -20;
const DHT_MAX = 35;


const STAR = require("../assets/star_empty.png");
const STAR_FILLED = require("../assets/star.png");


function temperature_color(temperature) {
    // calculates a color based on temperature
    const value_center = 20;

    // const green_val = (255 - mapValue(Math.abs(temperature-value_center), 0, (value_center-DHT_MIN), 0, 255));
    const green_val = (temperature > value_center) ? (255 - mapValue(temperature, value_center, DHT_MAX, 0, 255)) : mapValue(temperature, DHT_MIN, value_center, 0, 255);
    const red_val = (temperature < value_center) ? 0 : mapValue(temperature, value_center, DHT_MAX, 0, 255);
    const blue_val = (temperature > value_center) ? 0 : (255 - mapValue(temperature, DHT_MIN, value_center, 0, 255));

    const total_brightness = green_val + red_val + blue_val;
    // // // so the total brightness matches LED_MAX
    const brightness_multiplier = 255 / total_brightness;
    // const brightness_multiplier = 1;

    return [
        Math.round(red_val * brightness_multiplier),
        Math.round(green_val * brightness_multiplier),
        Math.round(blue_val * brightness_multiplier),
    ]
}


export function StationBox(props)
{
    const navigation = props.navigation;
    const clickable = props.clickable;
    const language = props.lang;
    props = props.data;

    // stations last measurements
    const [lastWeather, setLastWeather] = useState([]);
    const [isFavourite, _setIsFavourite] = useState(false);

    function setIsFavourite(favourites)
    {
        _setIsFavourite(favourites.includes(props.id));
    }

    useEffect(() => {
        getWeatherData(setLastWeather, 5, `station_id=${props.id}`)
        setInterval(getWeatherData.bind(this, setLastWeather, 5, `station_id=${props.id}`), 10000);

        getFavourites(setIsFavourite);
        setInterval(getFavourites.bind(this, setIsFavourite), 200);
    }, []);

    if (lastWeather.length === 0) {
        return
    }

    // style functions
    function boxStyle(pressed) {
        let background;
        if (isFavourite)
        {
            if (pressed && clickable)
            {
                background = 'rgba(202,201,125,0.5)';
            }
            else
            {
                background = 'rgba(153,152,92,0.5)';
            }
        }
        else
        {
            if (pressed && clickable)
            {
                background = 'rgba(157,157,157,0.5)';
            }
            else
            {
                background = 'rgba(116,116,116,0.5)';
            }

        }

        return {
            backgroundColor: background,
            padding: Dimensions.get('screen').width / 15,
            borderRadius: Dimensions.get('screen').width / 15,
            width: "90%",
        }
    }

    let temperatures = [];
    lastWeather.map((measurement) => temperatures.push(measurement.temperature));
    const trend = getWeatherTrend(lastWeather[0].temperature, temperatures);

    return (
        <View
            style={stationStyles.positionBox}
        >
            <Pressable
                style={({pressed}) => boxStyle(pressed)}
                onPress={() => {
                    if (clickable) {
                        navigation.navigate("StationInformation", {data: props, lang: language})
                    }
                }}
            >
                <View style={stationStyles.infoBox}>
                    <Text style={stationStyles.positionText}>
                        {props.position}
                    </Text>
                    <Image
                        style={stationStyles.icon}
                        source={weatherTypePredictor(
                            lastWeather[0].temperature,
                            lastWeather[0].humidity,
                            lastWeather[0].time
                        )}
                    />
                </View>
                <View style={stationStyles.infoBox}>
                    <Text style={stationStyles.infoText}>
                        {language.temperature}
                    </Text>
                    <Text style={stationStyles.infoValue}>
                        {trend ? "↑" : "↓"} {Math.round(lastWeather[0].temperature * 10) / 10} °C
                    </Text>
                </View>
                <View style={stationStyles.infoBox}>
                    <Text style={stationStyles.infoText}>
                        {language.name}
                    </Text>
                    <Text style={stationStyles.infoValue}>
                        {props.name}
                    </Text>
                </View>
                <View style={stationStyles.infoBox}>
                    <Text style={stationStyles.infoText}>
                        {language.height}
                    </Text>
                    <Text style={stationStyles.infoValue}>
                        {props.height} m
                    </Text>
                </View>
            </Pressable>
        </View>
    )
}


export function FavBox(props)
{
    const id = props.id;
    const [isFavourite, _setIsFavourite] = useState(false);

    function setIsFavourite(favourites)
    {
        _setIsFavourite(favourites.includes(id));
    }

    useEffect(() => {
        getFavourites(setIsFavourite);
        setInterval(getFavourites.bind(this, setIsFavourite), 1000);
    }, [])

    return (
        <Pressable
            onPress={() => {
                _setIsFavourite(!isFavourite);
                setFavourite(id, !isFavourite);
            }}
            style={favStyles.box}
        >
            <Image
                style={favStyles.star}
                source={isFavourite ? STAR_FILLED : STAR}
            />
        </Pressable>
    )
}


export function LastWeatherData(props)
{
    const language = props.lang;
    const data = props.data;

    // maths
    const maxNeg = -30;
    const maxPos = 40;

    const isPos = data.temperature > 0;
    const progress = (isPos) ? data.temperature / maxPos : data.temperature / maxNeg;

    // style
    const now_color = temperature_color(data.temperature);
    const graphColor = `rgba(${now_color[0]}, ${now_color[1]}, ${now_color[2]}, 1)`

    // functions
    function progressFormat(_) {
        return (Math.round(data.temperature * 10) / 10) + "°C";
    }

    function timeFixer(time) {
        let date = time.slice(0, -9)

        let dates = date.split(".")
        date = ""

        dates.reverse().forEach((element) => {
            date += element + "."
        })
        date = date.slice(0, -1)

        let daytime = time.slice(-8, -3)

        return daytime + ", " + date
    }

    return (
        <View style={stationStyles.positionBox}>
            <View style={{marginBottom: 10}}>
                <Progress.Circle
                    size={Dimensions.get('window').width * 0.8}
                    progress={progress}
                    animated={true}
                    showsText={true}
                    allowFontScaling={false}
                    formatText={progressFormat}
                    borderWidth={0}
                    thickness={15}
                    strokeCap={"round"}
                    textStyle={weatherStyles.graphText}
                    unfilledColor={"rgba(70,70,70,0.5)"}
                    color={graphColor}
                />
            </View>
            <View style={{width: "77%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={stationStyles.infoText}>
                    {language.temperatureIndexShort}
                </Text>
                <Text style={stationStyles.infoValue}>
                    {Math.round(data.temperature_index * 10) / 10} °C
                </Text>
            </View>
            <View style={{width: "77%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={stationStyles.infoText}>
                    {language.humidity}
                </Text>
                <Text style={stationStyles.infoValue}>
                    {Math.round(data.humidity * 10) / 10} %
                </Text>
            </View>
            <View style={{width: "77%", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={stationStyles.infoText}>
                    {language.lastMeasurement}
                </Text>
                <Text style={stationStyles.infoValue}>
                    {timeFixer(data.time)}
                </Text>
            </View>
        </View>
    )
}


export function WeatherGraphs(props)
{
    const language = props.lang;
    let [n, _setN] = useState(props.n);

    let n_labels = props.n_labels;

    if (!n_labels) {
        n_labels = 4;
    }

    // get weather data
    const [weather, setWeather] = useState([]);
    // const [nTimeoutID, setNTimeoutID] = useState(0);

    useEffect(() => {
        getWeatherData(setWeather, n, `station_id=${props.station_id}`);
    }, [])

    if (weather.length === 0) {
        return
    }

    // on slider change
    function setN(value) {
        _setN(value);
        setN2(value);
    }

    // only execute after the slider stands still for 1 sec
    function setN2(value) {
        getWeatherData(setWeather, value, `station_id=${props.station_id}`);
    }


    // reverse the data to be displayed properly
    const r_weather = weather[0].id > weather[weather.length - 1].id ? weather.reverse() : weather;

    // extract weather data
    const temps = r_weather.map(({temperature}) => temperature);
    const temp_indexes = r_weather.map(({temperature_index}) => temperature_index);

    const hums = r_weather.map(({humidity}) => humidity);
    const press = r_weather.map(({air_pressure}) => air_pressure * 10)

    // get labels
    const n_indent = Math.trunc(weather.length / (n_labels - 1));
    const labels = r_weather.map(({time}) => time).filter((value, index) => (
        index % n_indent === 0
    )).map((value) => value.slice(-8, -3));

    function PressGraph() {
        if (press[0]) {
            return (
                <LineChart
                    withInnerLines={false}
                    withDots={false}
                    withShadow={false}
                    data={{
                        labels: labels,
                        datasets: [
                            {
                                data: press,
                                color: (_opacity = 1) => `rgba(125, 125, 125, .6)`
                            },
                        ],
                        legend: [
                            "Luftdruck",
                        ]
                    }}
                    width={Dimensions.get('window').width - 50}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: 'rgb(116,116,116)',
                        backgroundGradientFromOpacity: .5,
                        backgroundGradientTo: 'rgb(116,116,116)',
                        backgroundGradientToOpacity: .5,
                        decimalPlaces: 1,
                        color: (_opacity = 1) => `rgba(170, 170, 170, .6)`,
                        style: {
                            borderRadius: 8,
                        }
                    }}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 25,
                    }}

                />
            )
        }
    }

    function fancyButtonBox(pressed, isSelected) {
        let bgColor
        if (isSelected) {
            bgColor = pressed ? 'rgba(157, 255, 157, .5)' : 'rgba(116, 255, 116, .5)';
        } else {
            bgColor = pressed ? 'rgba(157, 157, 157, .5)' : 'rgba(116, 116, 116, .5)';
        }

        return {
            padding: (Dimensions.get('window').width) / 40,
            borderRadius: (Dimensions.get('window').width) / 20,
            backgroundColor: bgColor,

            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }
    }

    return (
        <View style={weatherStyles.dataBox}>
            <View style={weatherStyles.buttonBox}>
                <Pressable
                    style={({pressed}) => fancyButtonBox(pressed, n===72)}
                    onPress={setN.bind(this, 72)}
                >
                    <Text style={fancyButton.font}>
                        6h
                    </Text>
                </Pressable>
                <Pressable
                    style={({pressed}) => fancyButtonBox(pressed, n===144)}
                    onPress={setN.bind(this, 144)}
                >
                    <Text style={fancyButton.font}>
                        12h
                    </Text>
                </Pressable>
                <Pressable
                    style={({pressed}) => fancyButtonBox(pressed, n===288)}
                    onPress={setN.bind(this, 288)}
                >
                    <Text style={fancyButton.font}>
                        1 Tag
                    </Text>
                </Pressable>
                <Pressable
                    style={({pressed}) => fancyButtonBox(pressed, n===2016)}
                    onPress={setN.bind(this, 2016)}
                >
                    <Text style={fancyButton.font}>
                        1 Woche
                    </Text>
                </Pressable>
            </View>
            <LineChart
                withInnerLines={false}
                withDots={false}
                withShadow={false}
                data={{
                    labels: labels,
                    datasets: [
                        {
                            data: temps,
                            color: (_opacity = 1) => `rgba(240, 30, 30, .6)`
                        },
                        {
                            data: temp_indexes,
                            color: (_opacity = 1) => `rgba(240, 120, 30, .6)`
                        }
                    ],
                    legend: [
                        language.temperature,
                        language.temperatureIndex,
                    ]
                }}
                width={Dimensions.get('window').width - 50}
                height={220}
                chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: 'rgb(116,116,116)',
                    backgroundGradientFromOpacity: .5,
                    backgroundGradientTo: 'rgb(116,116,116)',
                    backgroundGradientToOpacity: .5,
                    decimalPlaces: 1,
                    color: (_opacity = 1) => `rgba(255, 80, 80, .6)`,
                    style: {
                        borderRadius: 8,
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 25,
                }}
            />
            <LineChart
                withInnerLines={false}
                withDots={false}
                withShadow={false}
                data={{
                    labels: labels,
                    datasets: [
                        {
                            data: hums,
                            color: (_opacity = 1) => `rgba(0, 125, 255, .6)`
                        },
                    ],
                    legend: [
                        language.humidity,
                    ]
                }}
                width={Dimensions.get('window').width - 50}
                height={220}
                chartConfig={{
                    backgroundColor: '#1cc910',
                    backgroundGradientFrom: 'rgb(116,116,116)',
                    backgroundGradientFromOpacity: .5,
                    backgroundGradientTo: 'rgb(116,116,116)',
                    backgroundGradientToOpacity: .5,
                    decimalPlaces: 1,
                    color: (_opacity = 1) => `rgba(30, 120, 240, .6)`,
                    style: {
                        borderRadius: 8,
                    }
                }}
                bezier
                style={{
                    marginVertical: 8,
                    borderRadius: 25,
                }}
            />
            <PressGraph/>
        </View>
    )
}


const stationStyles = StyleSheet.create({
    positionBox: {
        marginVertical: Dimensions.get('window').width / 20,
        display: "flex",
        width: Dimensions.get('window').width,
        justifyContent: "center",
        alignItems: "center",
    },
    infoBox: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    positionText: {
        fontFamily: "sans-serif-light",
        fontSize: (Dimensions.get('window').width) / 10,
        fontWeight: "bold",
        color: "white",
        paddingBottom: 15,
        letterSpacing: (Dimensions.get('window').width) / 100,
    },
    infoText: {
        fontSize: (Dimensions.get('window').width) / 25,
        color: "white"
    },
    infoValue: {
        fontSize: (Dimensions.get('window').width) / 25,
        color: "#aeaeae",
    },
    icon: {
        width: Dimensions.get('window').width / 20,
        height: Dimensions.get('window').width / 20,
        marginBottom: Dimensions.get('window').width / 40,
    }
})

const weatherStyles = StyleSheet.create({
    graphText: {
        fontSize: Dimensions.get('window').width / 6,
        fontWeight: "400",
        color: "white",
    },
    dataBox: {
        paddingVertical: 30,
        alignItems: "center",
        width: "100%",
    },
    heading: {
        fontSize: Dimensions.get('window').width / 10,
        color: "white",
    },
    buttonBox: {
        width: (Dimensions.get('window').width * .9) - 50,

        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    }
})

const fancyButton = StyleSheet.create({
    font: {
        color: "white",
        fontWeight: "500",
        letterSpacing: (Dimensions.get('window').width) / 150,
        fontSize: (Dimensions.get('window').width) / 25,
    }
})


const favStyles = StyleSheet.create({
    box: {
        width: "75%",
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "row",
    },
    star: {
        width: Dimensions.get('window').width / 15,
        height: Dimensions.get('window').width / 15,
    }
})
