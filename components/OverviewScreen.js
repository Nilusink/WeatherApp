/*
OverviewScreen.js
10. January 2023

Default Screen

Author:
Nilusink
*/
import {StyleSheet, View, FlatList, Pressable, TextInput, Dimensions, SafeAreaView} from 'react-native';
import { useEffect, useState } from "react";
import { getWeatherStations } from "./requesters";
import { StationBox } from "./uiElements";


export default function DefaultScreen({navigation}) {
    let [stations, setStations] = useState([]);
    let [text, setText] = useState("");
    let [entryFocus, setEntryFocus] = useState(false);

    useEffect(() => {
        getWeatherStations(setStations);
    }, [])

    function filterStations(stations)
    {
        const matchString = (s1, s2) => s1.toLowerCase().includes(s2.toLowerCase())
        return stations.filter(station => matchString(station.position, text) || matchString(station.name, text));
    }

    function entryStyle()
    {
        let out = {
            width: "80%",
            color: (entryFocus) ? "white" : "#ddd",
            backgroundColor: `rgba(100, 100, 100, ${(entryFocus) ? .7 : .5})`,
            marginTop: Dimensions.get('window').height / 60,
            padding: Dimensions.get('window').width / 30,
            fontSize: Dimensions.get('window').width / 20,
            borderRadius: Dimensions.get('window').width / 20,
            borderWidth: 3,
            borderColor: "#444",
        }
        return out
    }

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={entryStyle()}
                onChangeText={(new_text) => setText(new_text)}
                value={text}
                placeholder={"Search"}
                placeholderTextColor={"#666"}
                onFocus={setEntryFocus.bind(this, true)}
                onBlur={setEntryFocus.bind(this, false)}
            />
            <FlatList
                style={{marginTop: Dimensions.get('window').width / 20, width: "100%"}}
                contentContainerStyle={{alignItems: "center"}}
                data={filterStations(stations)}
                renderItem={(x) => {
                    return (
                        <StationBox
                            data={x.item}
                            navigation={navigation}
                            clickable={true}
                        />
                    )
                }}
            />
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#113',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: "100%",
        height: "100%",
    },
});
