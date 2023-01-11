/*
StationInformation.js
10. January 2023

Information of a station

Author:
Nilusink
*/
/*
OverviewScreen.js
10. January 2023

Default Screen

Author:
Nilusink
*/
import {ScrollView, StyleSheet, View} from 'react-native';
import { getWeatherData } from "./requesters";
import { StationBox, LastWeatherData, TemperatureGraph } from "./uiElements";
import { useEffect, useState } from "react";


export default function StationInformation({navigation, route}) {
    const params = route.params;

    let [weather, setWeather] = useState([])

    useEffect(() => {
        getWeatherData(setWeather, 1)
        setInterval(getWeatherData.bind(this, setWeather, 1), 20000)
    }, [])

    if (weather.length === 0) {
        return (
            <View style={styles.container}/>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{width: "100%", alignItems: "center"}}>
                <StationBox
                    data={params.data}
                    navigation={navigation}
                    clickable={false}
                />
                <LastWeatherData
                    data={weather[0]}
                />
                <TemperatureGraph n={12 * 6}/>
            </ScrollView>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#113',
        alignItems: 'center',
        width: "100%",
        height: "100%",
    },
});
