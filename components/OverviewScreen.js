/*
OverviewScreen.js
10. January 2023

Default Screen

Author:
Nilusink
*/
import {Text, StyleSheet, View, FlatList, Pressable, TextInput, Dimensions, SafeAreaView, Image} from 'react-native';
import {getWeatherStations} from "./requesters";
import {getFavourites} from "./storage";
import {useEffect, useState} from "react";
import {StationBox} from "./uiElements";

import { getLocales, getCalendars } from 'expo-localization';
// import I18n from "i18n-js";

import de from "../assets/translations/de.json"
import en from "../assets/translations/en.json"


const MAGNIFIER = require("../assets/magnifying-glass.png");

// language setup
const DEFAULT_LOCALE = "en-US";
const LANGUAGES = {
    "de": de,
    "en": en
}
let LANGUAGE = LANGUAGES[DEFAULT_LOCALE];

// assign language
const locales = getLocales();
for (const loc in locales)
{
    if (locales[loc].languageTag.slice(0, 2) in LANGUAGES)
    {
        LANGUAGE = LANGUAGES[locales[loc].languageTag.slice(0, 2)];
        break;
    }
}

export default function DefaultScreen({navigation})
{
    let [stations, setStations] = useState([]);
    let [text, setText] = useState("");
    let [entryFocus, setEntryFocus] = useState(false);
    let [favourites, setFavourites] = useState([]);

    useEffect(() => {
        getWeatherStations(setStations);
        getFavourites(setFavourites);

        setInterval(getFavourites.bind(this, setFavourites), 200);
    }, [])

    function filterStations(stations) {
        // only stations according to the search
        const matchString = (s1, s2) => s1.toLowerCase().includes(s2.toLowerCase())
        let out = stations.filter(station => matchString(station.position, text) || matchString(station.name, text));

        // // prioritise favourites
        let favs = [];
        out.map(station => {
            if (favourites.includes(station.id))
            {
                favs.push(station);
            }
        })

        // put favourites at first and remove any duplicates by converting to a set
        return [... new Set(favs.concat(out))];
    }

    function entryStyle() {
        let out = {
            width: "80%",
            color: (entryFocus) ? "white" : "#ddd",
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

    const fStations = filterStations(stations);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchBar}>
                <TextInput
                    style={entryStyle()}
                    onChangeText={(new_text) => setText(new_text)}
                    value={text}
                    placeholder={LANGUAGE.search}
                    placeholderTextColor={"#666"}
                    onFocus={setEntryFocus.bind(this, true)}
                    onBlur={setEntryFocus.bind(this, false)}
                />
                <IconImage/>
            </View>
            <Text style={styles.stationsFound}>
                {/*{fStations.length} Station{(fStations.length > 1) ? "en" : ""} gefunden*/}
                {LANGUAGE.stationsFound.replace("<v>", fStations.length)}
            </Text>
            <FlatList
                style={{marginTop: Dimensions.get('window').width / 50, width: "100%"}}
                contentContainerStyle={{alignItems: "center"}}
                data={fStations}
                renderItem={(x) => {
                    return (
                        <StationBox
                            data={x.item}
                            navigation={navigation}
                            clickable={true}
                            lang={LANGUAGE}
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
    stationsFound: {
        color: "#aaa",
        width: "75%",
        marginTop: Dimensions.get('window').width / 50,
    }
});
