/*
OverviewScreen.js
10. January 2023

Default Screen

Author:
Nilusink
*/
import {Text, StyleSheet, View, FlatList, Pressable, TextInput, Dimensions, SafeAreaView, Image} from 'react-native';
import {useEffect, useState} from "react";
import {getWeatherStations} from "./requesters";
import {StationBox} from "./uiElements";


const MAGNIFIER = require("../assets/magnifying-glass.png");


export default function DefaultScreen({navigation}) {
    let [stations, setStations] = useState([]);
    let [text, setText] = useState("");
    let [entryFocus, setEntryFocus] = useState(false);

    useEffect(() => {
        getWeatherStations(setStations);
    }, [])

    function filterStations(stations) {
        const matchString = (s1, s2) => s1.toLowerCase().includes(s2.toLowerCase())
        return stations.filter(station => matchString(station.position, text) || matchString(station.name, text));
    }

    function entryStyle() {
        let out = {
            width: "80%",
            color: (entryFocus) ? "white" : "#ddd",
            // backgroundColor: `rgba(100, 100, 100, ${(entryFocus) ? .7 : .5})`,
            marginTop: Dimensions.get('window').height / 60,
            padding: Dimensions.get('window').width / 30,
            fontSize: Dimensions.get('window').width / 20,
            borderBottomWidth: 1,
            borderColor: "white",
        }
        return out
    }

    function IconImage()
    {
        // only show the image if no text is entered
        if (text === "")
        {
            return (
                <Image source={MAGNIFIER}
                       style={styles.img}
                />
            )
        }
        else {return ""}
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchBar}>
                <TextInput
                    style={entryStyle()}
                    onChangeText={(new_text) => setText(new_text)}
                    value={text}
                    placeholder={"Search"}
                    placeholderTextColor={"#666"}
                    onFocus={setEntryFocus.bind(this, true)}
                    onBlur={setEntryFocus.bind(this, false)}
                />
                <IconImage/>
            </View>
            <FlatList
                style={{marginTop: Dimensions.get('window').width / 50, width: "100%"}}
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
    searchBar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
    },
    img: {
        position: "absolute",
        left: Dimensions.get('window').width / 1.4,
        bottom: Dimensions.get('window').width / 28,
        width: Dimensions.get('window').width / 17,
        height: Dimensions.get('window').width / 17,
    },
});
